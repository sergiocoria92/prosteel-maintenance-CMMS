import { NextResponse } from 'next/server';
import { fetchInventoryItems } from '@/app/lib/data';

export async function GET() {
  // /api/inventory-test/route.ts
  const rows = await fetchInventoryItems({ q: '', type: 'consumable' });

  return NextResponse.json({ count: rows.length, rows });
}
