// app/seed/route.ts
import postgres from 'postgres';

// IMPORTA tus datasets existentes (los tuyos)
import { invoices, customers, revenue, users, repairRequests } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
type SqlClient = typeof sql;

async function seedExtensions(db: SqlClient) {
  await db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

/* =========================
   INVENTORY: TABLAS + DATA
   ========================= */
async function seedInventory(db: SqlClient) {
  // 1) Tablas
  await db`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      vin VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      year_added INT,
      status VARCHAR(50),
      photo_url TEXT,

      -- NUEVO: cantidad para tool/spare/consumable(item)
      qty INT NOT NULL DEFAULT 1,
      unit VARCHAR(50)
    );
  `;

  await db`
    CREATE TABLE IF NOT EXISTS inventory_consumables (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      part_number VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      qty INT NOT NULL DEFAULT 0
    );
  `;

  await db`
    CREATE TABLE IF NOT EXISTS inventory_item_consumables (
      item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
      consumable_id UUID NOT NULL REFERENCES inventory_consumables(id) ON DELETE CASCADE,
      qty_used INT NOT NULL DEFAULT 1,
      PRIMARY KEY (item_id, consumable_id)
    );
  `;

  // 2) Consumables globales (estos son los 3 que ves en Machine)
  const c1 = 'PN-1001';
  const c2 = 'PN-2002';
  const c3 = 'PN-3003';

  await db`
    INSERT INTO inventory_consumables (part_number, name, description, qty)
    VALUES
      (${c1}, 'Hydraulic Oil ISO 46', 'Standard hydraulic oil for systems', 12),
      (${c2}, 'Grease NLGI #2', 'Multipurpose grease for bearings', 6),
      (${c3}, 'Air Filter 3/8"', 'Compressed air line filter', 20)
    ON CONFLICT (part_number) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description
  `;

  // 3) Items (por tab)
  await db`
    INSERT INTO inventory_items (type, vin, name, location, year_added, status, photo_url, qty, unit)
    VALUES
      ('machine',     'VIN1013',     'Laser Cutter W3000',      'Machine Shop',      2017, 'working',   NULL, 1,   NULL),
      ('auxiliary',   'VIN-AUX-22',  'Air Compressor 60gal',    'Maintenance Room',  2020, 'repairing', NULL, 1,   NULL),
      ('tool',        'VIN-T-09',    'Torque Wrench 1/2"',      'Tool Crib',         2023, 'working',   NULL, 2,   'pcs'),
      ('spare_part',  'VIN-SP-77',   'Hydraulic Hose 3/4"',     'Spare Parts Rack',  2024, 'working',   NULL, 3,   'pcs'),
      ('consumable',  'VIN-C-01',    'Shop Rags Pack',          'Warehouse',         2024, 'working',   NULL, 10,  'packs')
    ON CONFLICT (vin) DO UPDATE
      SET name = EXCLUDED.name,
          location = EXCLUDED.location,
          qty = EXCLUDED.qty,
          unit = EXCLUDED.unit
  `;

  // 4) Link consumables a la machine VIN1013 (para que View(3) salga)
  const [machine] = await db<{ id: string }[]>`
    SELECT id FROM inventory_items WHERE vin = 'VIN1013' LIMIT 1
  `;

  const cons = await db<{ id: string; part_number: string }[]>`
    SELECT id, part_number
    FROM inventory_consumables
    WHERE part_number IN (${c1}, ${c2}, ${c3})
  `;

  if (machine?.id && cons?.length) {
    for (const c of cons) {
      await db`
        INSERT INTO inventory_item_consumables (item_id, consumable_id, qty_used)
        VALUES (${machine.id}, ${c.id}, 1)
        ON CONFLICT (item_id, consumable_id) DO NOTHING
      `;
    }
  }
}

/* =========================
   TU GET
   ========================= */
export async function GET() {
  try {
    await sql.begin(async (db) => {
      // Extensiones
      await seedExtensions(db);

      // ===> Aquí van TUS seeds existentes tal cual los tienes (users/customers/invoices/etc)
      // seedUsers(db)...
      // seedCustomers(db)...
      // seedInvoices(db)...
      // seedRevenue(db)...
      // seedRepairRequests(db)...

      // INVENTORY (sin borrar)
      await seedInventory(db);
    });

    return Response.json({ message: 'Database seeded successfully (including inventory).' });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}










// import bcrypt from 'bcrypt';
// import postgres from 'postgres';
// import { invoices, customers, revenue, users } from '../lib/placeholder-data';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// type SqlClient = typeof sql;

// async function seedExtensions(db: SqlClient) {
//   await db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
// }

// async function seedUsers(db: SqlClient) {
//   await db`
//     CREATE TABLE IF NOT EXISTS users (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     );
//   `;

//   await Promise.all(
//     users.map(async (user) => {
//       const hashedPassword = await bcrypt.hash(user.password, 10);
//       return db`
//         INSERT INTO users (id, name, email, password)
//         VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//     }),
//   );
// }

// async function seedCustomers(db: SqlClient) {
//   await db`
//     CREATE TABLE IF NOT EXISTS customers (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL,
//       image_url VARCHAR(255) NOT NULL
//     );
//   `;

//   await Promise.all(
//     customers.map((customer) => db`
//       INSERT INTO customers (id, name, email, image_url)
//       VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
//       ON CONFLICT (id) DO NOTHING;
//     `),
//   );
// }

// async function seedInvoices(db: SqlClient) {
//   await db`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       customer_id UUID NOT NULL REFERENCES customers(id),
//       amount INT NOT NULL,
//       status VARCHAR(255) NOT NULL,
//       date DATE NOT NULL
//     );
//   `;

//   await Promise.all(
//     invoices.map((invoice) => db`
//       INSERT INTO invoices (customer_id, amount, status, date)
//       VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
//       ON CONFLICT (id) DO NOTHING;
//     `),
//   );
// }

// async function seedRevenue(db: SqlClient) {
//   await db`
//     CREATE TABLE IF NOT EXISTS revenue (
//       month VARCHAR(4) NOT NULL UNIQUE,
//       revenue INT NOT NULL
//     );
//   `;

//   await Promise.all(
//     revenue.map((rev) => db`
//       INSERT INTO revenue (month, revenue)
//       VALUES (${rev.month}, ${rev.revenue})
//       ON CONFLICT (month) DO NOTHING;
//     `),
//   );
// }

// export async function GET() {
//   try {
//     await sql.begin(async (db) => {
//       // 1) Extensions (once)
//       await seedExtensions(db);

//       // 2) Tables + data (in order)
//       await seedUsers(db);
//       await seedCustomers(db);
//       await seedInvoices(db);
//       await seedRevenue(db);
//     });

//     return Response.json({ message: 'Database seeded successfully' });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error }, { status: 500 });
//   }
// }





