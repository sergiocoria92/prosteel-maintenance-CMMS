import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export async function GET() {
  // Bloquear en producción
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ ok: false }, { status: 404 });
  }

  const email = 'admin@demo.com';
  const plain = '1357coria';

  const meta = await sql`
    SELECT current_database() AS db,
           current_schema() AS schema,
           current_setting('search_path') AS search_path
  `;

  const r = await sql`
    SELECT id, email, password
    FROM public.users
    WHERE email = ${email}
    LIMIT 1
  `;

  const user = r.rows[0] as any;
  const match = user ? await bcrypt.compare(plain, user.password) : false;

  return Response.json({
    ok: true,
    db: meta.rows[0],
    found: !!user,
    email: user?.email ?? null,
    pass_len: user?.password?.length ?? null,
    hash_prefix: user?.password?.slice(0, 4) ?? null,
    match,
  });
}
