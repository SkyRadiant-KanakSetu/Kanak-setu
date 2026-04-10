import { z } from 'zod';
/**
 * Typed environment for Node services. Load with dotenv in process entrypoints
 * (e.g. apps/api/src/server.ts), then parse process.env.
 */
export declare const serverEnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodUnion<[z.ZodString, z.ZodString]>;
    REDIS_URL: z.ZodOptional<z.ZodString>;
    JWT_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRY: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRY: z.ZodDefault<z.ZodString>;
    CORS_ORIGINS: z.ZodOptional<z.ZodString>;
    API_BASE_URL: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRY: string;
    JWT_REFRESH_EXPIRY: string;
    REDIS_URL?: string | undefined;
    CORS_ORIGINS?: string | undefined;
    API_BASE_URL?: string | undefined;
}, {
    DATABASE_URL: string;
    JWT_SECRET: string;
    NODE_ENV?: "development" | "test" | "production" | undefined;
    PORT?: number | undefined;
    REDIS_URL?: string | undefined;
    JWT_ACCESS_EXPIRY?: string | undefined;
    JWT_REFRESH_EXPIRY?: string | undefined;
    CORS_ORIGINS?: string | undefined;
    API_BASE_URL?: string | undefined;
}>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export declare function parseServerEnv(env: NodeJS.ProcessEnv): ServerEnv;
//# sourceMappingURL=index.d.ts.map