// app/lib/placeholder-data.ts

/**
 * NOTA IMPORTANTE:
 * - NO agregamos uuid ni nada.
 * - IDs fijos.
 * - Reusamos customers como “máquinas” (solo cambia el texto que pongas).
 * - Reusamos invoices como “órdenes de trabajo” (status pending/paid).
 * - Reusamos revenue como “cumplimiento preventivos” (0..100).
 */

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

// Customers => Máquinas (puedes cambiar nombres/áreas aquí)
const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'WaterJet 1',
    email: 'Cutting',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Laser W3000',
    email: 'Cutting',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Enerpac Pump',
    email: 'Hydraulics',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'RayTools Head',
    email: 'Laser',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Air Compressor',
    email: 'Facilities',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'CNC Router',
    email: 'Cutting',
    image_url: '/customers/balazs-orban.png',
  },
];

// Invoices => Órdenes de trabajo (status: pending=abierta, paid=cerrada)
// amount lo dejamos como número (no importa el significado todavía).
const invoices = [
  { customer_id: customers[0].id, amount: 15795, status: 'pending', date: '2024-12-06' },
  { customer_id: customers[1].id, amount: 20348, status: 'pending', date: '2024-12-14' },
  { customer_id: customers[4].id, amount: 3040,  status: 'paid',    date: '2024-12-29' },
  { customer_id: customers[3].id, amount: 44800, status: 'paid',    date: '2025-01-10' },
  { customer_id: customers[5].id, amount: 34577, status: 'pending', date: '2025-01-05' },
  { customer_id: customers[2].id, amount: 54246, status: 'pending', date: '2025-01-16' },
  { customer_id: customers[0].id, amount: 666,   status: 'pending', date: '2025-01-27' },
  { customer_id: customers[3].id, amount: 32545, status: 'paid',    date: '2025-01-09' },
];

// NUEVO: solicitudes de reparación (tabla repair_requests)
const repairRequests = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    machine_id: customers[0].id,
    title: 'Fuga en línea de alta presión',
    assigned_to: 'Sergio (MTTO)',
    status: 'open',
    date: '2025-01-25',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    machine_id: customers[1].id,
    title: 'Lente sucio / baja potencia',
    assigned_to: 'Equipo Laser',
    status: 'in_progress',
    date: '2025-01-23',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    machine_id: customers[2].id,
    title: 'Presión inestable',
    assigned_to: 'Hydraulics Team',
    status: 'open',
    date: '2025-01-22',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    machine_id: customers[4].id,
    title: 'Filtro saturado',
    assigned_to: 'Facilities',
    status: 'closed',
    date: '2025-01-18',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    machine_id: customers[5].id,
    title: 'Ruido en husillo',
    assigned_to: 'CNC Team',
    status: 'open',
    date: '2025-01-28',
  },
];

// revenue => Cumplimiento de preventivos (%)
const revenue = [
  { month: 'Jan', revenue: 92 },
  { month: 'Feb', revenue: 88 },
  { month: 'Mar', revenue: 90 },
  { month: 'Apr', revenue: 86 },
  { month: 'May', revenue: 91 },
  { month: 'Jun', revenue: 93 },
  { month: 'Jul', revenue: 89 },
  { month: 'Aug', revenue: 94 },
  { month: 'Sep', revenue: 87 },
  { month: 'Oct', revenue: 90 },
  { month: 'Nov', revenue: 85 },
  { month: 'Dec', revenue: 95 },
];

export { users, customers, invoices, revenue, repairRequests };



// // This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// // https://nextjs.org/learn/dashboard-app/fetching-data
// const users = [
//   {
//     id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     name: 'User',
//     email: 'user@nextmail.com',
//     password: '123456',
//   },
// ];

// const customers = [
//   {
//     id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
//     name: 'Evil Rabbit',
//     email: 'evil@rabbit.com',
//     image_url: '/customers/evil-rabbit.png',
//   },
//   {
//     id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
//     name: 'Delba de Oliveira',
//     email: 'delba@oliveira.com',
//     image_url: '/customers/delba-de-oliveira.png',
//   },
//   {
//     id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
//     name: 'Lee Robinson',
//     email: 'lee@robinson.com',
//     image_url: '/customers/lee-robinson.png',
//   },
//   {
//     id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
//     name: 'Michael Novotny',
//     email: 'michael@novotny.com',
//     image_url: '/customers/michael-novotny.png',
//   },
//   {
//     id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
//     name: 'Amy Burns',
//     email: 'amy@burns.com',
//     image_url: '/customers/amy-burns.png',
//   },
//   {
//     id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
//     name: 'Balazs Orban',
//     email: 'balazs@orban.com',
//     image_url: '/customers/balazs-orban.png',
//   },
// ];

// const invoices = [
//   {
//     customer_id: customers[0].id,
//     amount: 15795,
//     status: 'pending',
//     date: '2022-12-06',
//   },
//   {
//     customer_id: customers[1].id,
//     amount: 20348,
//     status: 'pending',
//     date: '2022-11-14',
//   },
//   {
//     customer_id: customers[4].id,
//     amount: 3040,
//     status: 'paid',
//     date: '2022-10-29',
//   },
//   {
//     customer_id: customers[3].id,
//     amount: 44800,
//     status: 'paid',
//     date: '2023-09-10',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 34577,
//     status: 'pending',
//     date: '2023-08-05',
//   },
//   {
//     customer_id: customers[2].id,
//     amount: 54246,
//     status: 'pending',
//     date: '2023-07-16',
//   },
//   {
//     customer_id: customers[0].id,
//     amount: 666,
//     status: 'pending',
//     date: '2023-06-27',
//   },
//   {
//     customer_id: customers[3].id,
//     amount: 32545,
//     status: 'paid',
//     date: '2023-06-09',
//   },
//   {
//     customer_id: customers[4].id,
//     amount: 1250,
//     status: 'paid',
//     date: '2023-06-17',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 8546,
//     status: 'paid',
//     date: '2023-06-07',
//   },
//   {
//     customer_id: customers[1].id,
//     amount: 500,
//     status: 'paid',
//     date: '2023-08-19',
//   },
//   {
//     customer_id: customers[5].id,
//     amount: 8945,
//     status: 'paid',
//     date: '2023-06-03',
//   },
//   {
//     customer_id: customers[2].id,
//     amount: 1000,
//     status: 'paid',
//     date: '2022-06-05',
//   },
// ];

// const revenue = [
//   { month: 'Jan', revenue: 2000 },
//   { month: 'Feb', revenue: 1800 },
//   { month: 'Mar', revenue: 2200 },
//   { month: 'Apr', revenue: 2500 },
//   { month: 'May', revenue: 2300 },
//   { month: 'Jun', revenue: 3200 },
//   { month: 'Jul', revenue: 3500 },
//   { month: 'Aug', revenue: 3700 },
//   { month: 'Sep', revenue: 2500 },
//   { month: 'Oct', revenue: 2800 },
//   { month: 'Nov', revenue: 3000 },
//   { month: 'Dec', revenue: 4800 },
// ];

// export { users, customers, invoices, revenue };
