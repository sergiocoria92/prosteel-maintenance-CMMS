// app/lib/data.ts
import postgres from 'postgres';
import type {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  InventoryItem,
  Consumable,
  LinkedConsumable,
} from './definitions';
import { formatCurrency } from './utils';

// =========================================================
// DB CONNECTION
// =========================================================
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* =========================================================
   1) REVENUE (YA EXISTE)
   ========================================================= */
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;
  } catch (error) {
    console.error('Database Error (fetchRevenue):', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

/* =========================================================
   2) LATEST INVOICES (YA EXISTE)
   ========================================================= */
export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.id, invoices.amount, customers.name, customers.image_url, customers.email
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error (fetchLatestInvoices):', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

/* =========================================================
   3) CARD DATA (YA EXISTE)
   ========================================================= */
export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;

    const invoiceStatusPromise = sql`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices
    `;

    const openWorkOrdersPromise = sql`
      SELECT COUNT(*) FROM invoices WHERE status = 'pending'
    `;
    const closedWorkOrdersPromise = sql`
      SELECT COUNT(*) FROM invoices WHERE status = 'paid'
    `;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
      openWorkOrdersPromise,
      closedWorkOrdersPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');

    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    const openWorkOrdersCount = Number(data[3][0].count ?? '0');
    const closedWorkOrdersCount = Number(data[4][0].count ?? '0');

    const repairRequestsCount = numberOfInvoices;
    const machinesCount = numberOfCustomers;

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
      openWorkOrdersCount,
      closedWorkOrdersCount,
      repairRequestsCount,
      machinesCount,
    };
  } catch (error) {
    console.error('Database Error (fetchCardData):', error);
    throw new Error('Failed to fetch card data.');
  }
}

/* =========================================================
   TODO LO DEMÁS (invoices/customers pages) SE QUEDA IGUAL
   ========================================================= */
const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return invoices;
  } catch (error) {
    console.error('Database Error (fetchFilteredInvoices):', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchInvoicesPages):', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    if (!data || data.length === 0) return null;

    const invoice = data[0];
    return { ...invoice, amount: invoice.amount / 100 };
  } catch (error) {
    console.error('Database Error (fetchInvoiceById):', error);
    return null;
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT id, name
      FROM customers
      ORDER BY name ASC
    `;
    return customers;
  } catch (err) {
    console.error('Database Error (fetchCustomers):', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error (fetchFilteredCustomers):', err);
    throw new Error('Failed to fetch customer table.');
  }
}

/* =========================================================
   INVENTORY (CORREGIDO A TUS TABLAS REALES EN NEON)
   ========================================================= */
export async function fetchInventoryItems({
  q,
  type,
}: {
  q: string;
  type: string;
}) {
  try {
    const safeQ = q ?? '';
    const safeType = type ?? 'machine';

    const rows = await sql<InventoryItem[]>`
  SELECT
    id,
    type,
    vin,
    name,
    location,
    year,
    qty,
    status,
    photo_url
  FROM inventory_items
  WHERE
    type = ${safeType}
    AND (
      ${safeQ} = '' OR
      vin ILIKE ${`%${safeQ}%`} OR
      name ILIKE ${`%${safeQ}%`} OR
      location ILIKE ${`%${safeQ}%`}
    )
  ORDER BY name ASC
  LIMIT 200
`;


    return rows;
  } catch (error) {
    console.error('Database Error (fetchInventoryItems):', error);
    return [];
  }
}


export async function fetchAllConsumables() {
  try {
    const rows = await sql<Consumable[]>`
      SELECT id, part_number, name, description, qty
      FROM consumables
      ORDER BY name ASC
      LIMIT 500
    `;
    return rows;
  } catch (error) {
    console.error('Database Error (fetchAllConsumables):', error);
    return [];
  }
}

export async function fetchFilteredConsumables(q: string) {
  try {
    const safeQ = q ?? '';
    const rows = await sql<Consumable[]>`
      SELECT id, part_number, name, description, qty
      FROM consumables
      WHERE
        ${safeQ} = '' OR
        part_number ILIKE ${`%${safeQ}%`} OR
        name ILIKE ${`%${safeQ}%`} OR
        description ILIKE ${`%${safeQ}%`}
      ORDER BY name ASC
      LIMIT 500
    `;
    return rows;
  } catch (error) {
    console.error('Database Error (fetchFilteredConsumables):', error);
    return [];
  }
}

export async function fetchConsumablesForItem(itemId: string) {
  try {
    const rows = await sql<LinkedConsumable[]>`
      SELECT
        c.id,
        c.part_number,
        c.name,
        c.description,
        ic.qty_used
      FROM inventory_item_consumables ic
      JOIN consumables c ON c.id = ic.consumable_id
      WHERE ic.inventory_item_id = ${itemId}
      ORDER BY c.name ASC
    `;
    return rows;
  } catch (error) {
    console.error('Database Error (fetchConsumablesForItem):', error);
    return [];
  }
}
