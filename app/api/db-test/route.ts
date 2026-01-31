import postgres from "postgres";

export async function GET() {
  const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
  const r = await sql`SELECT now() as now`;
  return Response.json({ ok: true, now: r[0].now });
}
