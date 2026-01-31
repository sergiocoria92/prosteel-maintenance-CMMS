// app/lib/definitions.ts

/* =========================================================
   REVENUE / INVOICES / CUSTOMERS (ya existían)
   ========================================================= */

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoiceRaw = {
  id: string;
  amount: number;
  name: string;
  image_url: string;
  email: string;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomerField = {
  id: string;
  name: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

/* =========================================================
   INVENTORY (nuevo)
   ========================================================= */

export type InventoryType =
  | 'machine'
  | 'aux'
  | 'tool'
  | 'spare_part'
  | 'consumable';

export type InventoryItem = {
  id: string;
  type: InventoryType | string;
  vin: string;
  name: string;
  location: string;
  status?: string | null;
  qty?: number | null;
  photo_url?: string | null;

  // ✅ NUEVO (para Date Added)
  created_at?: string | null;
};

export type Consumable = {
  id: string;
  part_number: string;
  name: string;
  qty?: number | null;
  description?: string | null;

  // ✅ NUEVO (para Date Added)
  created_at?: string | null;
};


export type LinkedConsumable = {
  id: string;
  part_number: string;
  name: string;

  // En tu JOIN actual se llama qty_used.
  qty_used?: number | null;

  // Por si en algún momento lo manejas como qty (no rompe nada).
  qty?: number | null;

  description?: string | null;
};







// // app/lib/definitions.ts

// /* =========================================================
//    EXISTING TYPES (do not break existing pages)
//    Comentarios (ES):
//    - Mantengo tus tipos base para invoices/customers/revenue.
//    - Luego agrego Inventory al final.
//    ========================================================= */

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// };

// export type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
// };

// export type Invoice = {
//   id: string;
//   customer_id: string;
//   amount: number;
//   date: string;
//   status: 'pending' | 'paid';
// };

// export type Revenue = {
//   month: string;
//   revenue: number;
// };

// export type LatestInvoice = {
//   id: string;
//   name: string;
//   image_url: string;
//   email: string;
//   amount: string;
// };

// export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
//   amount: number;
// };

// export type InvoicesTable = {
//   id: string;
//   customer_id: string;
//   name: string;
//   email: string;
//   image_url: string;
//   date: string;
//   amount: number;
//   status: 'pending' | 'paid';
// };

// export type CustomersTableType = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
//   total_invoices: number;
//   total_pending: number;
//   total_paid: number;
// };

// export type FormattedCustomersTable = {
//   id: string;
//   name: string;
//   email: string;
//   image_url: string;
//   total_invoices: number;
//   total_pending: string;
//   total_paid: string;
// };

// export type CustomerField = {
//   id: string;
//   name: string;
// };

// export type InvoiceForm = {
//   id: string;
//   customer_id: string;
//   amount: number;
//   status: 'pending' | 'paid';
// };

// /* =========================================================
//    CMMS (optional - if you're using it)
//    Comentarios (ES):
//    - Si no lo usas todavía, no pasa nada tenerlo aquí.
//    ========================================================= */

// export type RepairRequest = {
//   id: string;
//   machine_id: string; // referencia a customers.id
//   title: string;
//   assigned_to: string;
//   status: 'open' | 'in_progress' | 'closed';
//   date: string; // YYYY-MM-DD
// };

// /* =========================================================
//    INVENTORY (NEW)
//    Comentarios (ES):
//    - IMPORTANTE: estos tipos deben coincidir con:
//      1) tus queries en app/lib/data.ts
//      2) las columnas reales en Postgres
//      3) lo que renderizas en app/ui/inventory/inventory-view.tsx
//    ========================================================= */

// // Comentarios (ES):
// // - Estos son los tabs que tú definiste.
// // - OJO: usa el MISMO texto que guardas en DB (columna type).
// export type InventoryType =
//   | 'machine'
//   | 'auxiliary'
//   | 'tool'
//   | 'spare_part'
//   | 'consumable';

// // Comentarios (ES):
// // - Status UI (dropdown). Guarda texto simple por ahora.
// export type InventoryStatus = 'working' | 'repairing' | 'down';

// // Comentarios (ES):
// // - Este es el “item” principal (máquina/herramienta/etc).
// // - year_added: lo estás trayendo en data.ts como year_added (NO year_installed).
// export type InventoryItem = {
//   id: string;
//   type: InventoryType;
//   vin: string;
//   name: string;
//   location: string;
//   year_added: number | null;
//   status: InventoryStatus | null;
//   photo_url: string | null;
// };

// // Comentarios (ES):
// // - Catálogo global de consumibles.
// export type Consumable = {
//   id: string;
//   part_number: string;
//   name: string;
//   qty: number;
// };

// // Comentarios (ES):
// // - Consumible ligado a un item + qty_used (tabla relación).
// // - NO existe "description" en tu query actual, por eso te marcaba rojo.
// export type LinkedConsumable = {
//   id: string;
//   part_number: string;
//   name: string;
//   qty_used: number;
// };

