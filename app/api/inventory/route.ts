// app/api/inventory/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import postgres from 'postgres';

const DATABASE_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!DATABASE_URL) {
  throw new Error(
    'Missing DATABASE_URL/POSTGRES_URL env var. Set it in .env.local (or Vercel env vars).',
  );
}

const sql = postgres(DATABASE_URL, {
  ssl: 'require', // Neon necesita SSL
});

type CreateInventoryItemBody = {
  mode: 'inventory_item';
  type: 'machine' | 'auxiliary' | 'tool' | 'spare_part';
  vin: string;
  name: string;
  location: string;
  qty?: number | null;
  date_added?: string | null; // 'YYYY-MM-DD' (opcional)
  status?: string | null; // por ahora fijo, pero lo recibimos por compatibilidad
  photo_url?: string | null;
};

type CreateConsumableBody = {
  mode: 'consumable';
  part_number: string;
  name: string;
  qty?: number | null;
  description?: string | null;
  // opcional: fecha de alta si ya la agregaste a la tabla
  date_added?: string | null; // 'YYYY-MM-DD'
  status?: string | null; // si lo agregaste para consumables
  condition?: string | null; // si lo agregaste para consumables
};

function badRequest(message: string, extra?: unknown) {
  return NextResponse.json({ ok: false, message, extra }, { status: 400 });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // machine|auxiliary|tool|spare_part|consumable?
    const q = (searchParams.get('q') || '').trim();

    // Si después quieres listar items desde aquí, lo dejamos listo.
    // Por ahora regresa un ping.
    return NextResponse.json({ ok: true, type, q });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateInventoryItemBody | CreateConsumableBody;

    if (!body || typeof body !== 'object' || !('mode' in body)) {
      return badRequest('Body inválido. Falta "mode".');
    }

    // =========================================================
    // 1) INSERT INVENTORY ITEM (machine/aux/tool/spare_part)
    // =========================================================
    if (body.mode === 'inventory_item') {
      const b = body as CreateInventoryItemBody;

      if (!b.type || !b.vin || !b.name || !b.location) {
        return badRequest('Faltan campos requeridos: type, vin, name, location');
      }

      // status fijo por ahora (como pediste)
      const status = 'working';

      // date_added opcional. Si no mandas, usamos hoy.
      const dateAdded = b.date_added ? b.date_added : null;

      // IMPORTANTE:
      // Ajusta estos nombres de columnas a tu tabla real.
      // En tus capturas estabas usando `inventory_items` con columnas:
      // type, vin, name, location, year, status, qty, photo_url
      //
      // Como quieres "date added" (fecha completa), asumo que ya creaste `date_added` (DATE)
      // Si aún NO existe esa columna, quita date_added del INSERT/RETURNING.

      const inserted = await sql<{
        id: string;
        type: string;
        vin: string;
        name: string;
        location: string;
        qty: number | null;
        status: string | null;
        photo_url: string | null;
        date_added: string | null;
      }[]>`
        INSERT INTO inventory_items (type, vin, name, location, qty, status, photo_url, date_added)
        VALUES (
          ${b.type},
          ${b.vin},
          ${b.name},
          ${b.location},
          ${b.qty ?? 1},
          ${status},
          ${b.photo_url ?? null},
          ${dateAdded}
        )
        RETURNING id, type, vin, name, location, qty, status, photo_url, date_added
      `;

      return NextResponse.json({ ok: true, row: inserted[0] });
    }

    // =========================================================
    // 2) INSERT CONSUMABLE (catalog)
    // =========================================================
    if (body.mode === 'consumable') {
      const b = body as CreateConsumableBody;

      if (!b.part_number || !b.name) {
        return badRequest('Faltan campos requeridos: part_number, name');
      }

      // Ajusta columnas según tu tabla `consumables`.
      // En tu código estabas consultando: id, part_number, name, description, qty
      // Si agregaste date_added/status/condition, déjalas. Si no, quítalas.

      const inserted = await sql<any[]>`
        INSERT INTO consumables (part_number, name, qty, description, date_added, status, condition)
        VALUES (
          ${b.part_number},
          ${b.name},
          ${b.qty ?? 0},
          ${b.description ?? null},
          ${b.date_added ?? null},
          ${b.status ?? 'working'},
          ${b.condition ?? 'new'}
        )
        RETURNING *
      `;

      return NextResponse.json({ ok: true, row: inserted[0] });
    }

    return badRequest('mode inválido.');
  } catch (e: any) {
    // Si truena por columna faltante, Neon devuelve un error claro aquí.
    return NextResponse.json(
      { ok: false, message: e?.message ?? 'Unknown error' },
      { status: 500 },
    );
  }
}
