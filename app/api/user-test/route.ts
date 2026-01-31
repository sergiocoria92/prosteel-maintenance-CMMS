import postgres from 'postgres';

export const runtime = 'nodejs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1) Confirma DB/schema y search_path
    const info = await sql<{
      db: string;
      schema: string;
      search_path: string;
    }[]>`
      SELECT
        current_database() AS db,
        current_schema() AS schema,
        current_setting('search_path') AS search_path
    `;

    // 2) Existe tabla users?
    const table = await sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'users'
      ) AS exists
    `;

    // 3) Existe admin@demo.com? (sin exponer hash)
    let admin = [{ found: false, pass_len: null as number | null }];

    if (table[0]?.exists) {
      admin = await sql<{ found: boolean; pass_len: number | null }[]>`
        SELECT
          EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@demo.com') AS found,
          (SELECT length(password) FROM public.users WHERE email = 'admin@demo.com' LIMIT 1) AS pass_len
      `;
    }

    return Response.json({
      ok: true,
      db: info[0]?.db,
      schema: info[0]?.schema,
      search_path: info[0]?.search_path,
      users_table_exists: table[0]?.exists ?? false,
      admin_found: admin[0]?.found ?? false,
      admin_password_length: admin[0]?.pass_len ?? null,
    });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
