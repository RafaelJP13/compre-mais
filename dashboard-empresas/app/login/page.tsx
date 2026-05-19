'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

// ─── IndexedDB helpers ───────────────────────────────────────────────────────

const DB_NAME = 'compre-flow';
const STORE = 'keys';

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function storeKey(name: string, key: CryptoKey): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(key, name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function loadKey(name: string): Promise<CryptoKey | null> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(name);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
    });
}

// ─── DPoP proof builder ──────────────────────────────────────────────────────

export async function buildDpopProof(
    method: string,
    url: string,
    accessToken?: string,
): Promise<string> {
    const privateKey = await loadKey('dpop_private');
    const publicKeyJwk = JSON.parse(
        localStorage.getItem('company_public_key') ?? 'null',
    );

    if (!privateKey || !publicKeyJwk) {
        throw new Error('DPoP keys not found');
    }

    const header = {
        typ: 'dpop+jwt',
        alg: 'ES256',
        jwk: publicKeyJwk,
    };

    const payload: Record<string, unknown> = {
        jti: crypto.randomUUID(),
        htm: method.toUpperCase(),
        htu: url.split('?')[0], // sem query string
        iat: Math.floor(Date.now() / 1000),
    };

    // ath: hash SHA-256 do access token
    if (accessToken) {
        const tokenBytes = new TextEncoder().encode(accessToken);
        const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBytes);
        payload.ath = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    const encode = (obj: object) =>
        btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');

    const signingInput = `${encode(header)}.${encode(payload)}`;

    const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        privateKey,
        new TextEncoder().encode(signingInput),
    );

    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return `${signingInput}.${sigB64}`;
}

// ─── Login page ──────────────────────────────────────────────────────────────

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            // 1. gerar par de chaves — privada NÃO exportável
            const keyPair = await crypto.subtle.generateKey(
                { name: 'ECDSA', namedCurve: 'P-256' },
                false, // extractable: false
                ['sign', 'verify'],
            );

            // 2. exportar apenas a chave pública (JWK)
            const publicKeyJwk = await crypto.subtle.exportKey(
                'jwk',
                keyPair.publicKey,
            );

            // 3. guardar chave pública no localStorage (não é segredo)
            localStorage.setItem(
                'company_public_key',
                JSON.stringify(publicKeyJwk),
            );

            // 4. guardar chave privada no IndexedDB (não sai do browser)
            await storeKey('dpop_private', keyPair.privateKey);

            // 5. login request
            const response = await fetch(
                'http://localhost:3000/company-auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, publicKey: publicKeyJwk }),
                },
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Invalid credentials');
            }

            const data = await response.json();

            localStorage.setItem('company_token', data.access_token);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-xl p-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-semibold text-zinc-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        Sign in to your company account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="text-sm text-zinc-700">Email</label>
                        <div className="relative mt-2">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-900 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-zinc-700">Password</label>
                        <div className="relative mt-2">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-900 focus:bg-white"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-zinc-400">
                    Secured with DPoP bound tokens
                </p>
            </div>
        </div>
    );
}