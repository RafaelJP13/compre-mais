import { Injectable } from '@nestjs/common';

@Injectable()
export class ReplayCache {
    // jti -> expiry timestamp (ms)
    private readonly cache = new Map<string, number>();

    // limpeza a cada 5 minutos
    constructor() {
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Retorna true se o jti já foi visto (replay).
     * Caso contrário, registra e retorna false.
     */
    has(jti: string, ttlSeconds: number = 120): boolean {
        const now = Date.now();
        const entry = this.cache.get(jti);

        if (entry !== undefined && entry > now) {
            return true; // replay detectado
        }

        this.cache.set(jti, now + ttlSeconds * 1000);
        return false;
    }

    private cleanup(): void {
        const now = Date.now();

        for (const [jti, expiry] of this.cache.entries()) {
            if (expiry <= now) {
                this.cache.delete(jti);
            }
        }
    }
}