"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
} from "lucide-react";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Invalid credentials"
                );
            }

            router.push("/dashboard");
        } catch (error) {
            alert("Erro ao logar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900">
                    Entrar
                </h2>

                <p className="mt-3 text-gray-500">
                    Faça login para acessar sua
                    plataforma.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* EMAIL */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        E-mail
                    </label>

                    <div
                        className="
                            mt-2
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            focus-within:ring-4
                            focus-within:ring-orange-200
                            focus-within:border-orange-400
                            transition
                        "
                    >
                        <Mail
                            size={18}
                            className="text-gray-400"
                        />

                        <input
                            type="email"
                            placeholder="voce@email.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                outline-none
                                bg-transparent
                            "
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Senha
                    </label>

                    <div
                        className="
                            mt-2
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            focus-within:ring-4
                            focus-within:ring-orange-200
                            focus-within:border-orange-400
                            transition
                        "
                    >
                        <Lock
                            size={18}
                            className="text-gray-400"
                        />

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                outline-none
                                bg-transparent
                            "
                        />
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        h-14
                        rounded-2xl
                        bg-[#ffac2e]
                        hover:bg-orange-500
                        transition-all
                        text-white
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                        shadow-lg
                        shadow-orange-200
                        disabled:opacity-60
                        cursor-pointer
                    "
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />
                            Entrando...
                        </>
                    ) : (
                        <>
                            Entrar
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}