import "dotenv/config";

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const ENV = {
  DATABASE_URL: req("DATABASE_URL"),
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_JWT_PUBLIC_KEY: process.env.SUPABASE_JWT_PUBLIC_KEY,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
};
