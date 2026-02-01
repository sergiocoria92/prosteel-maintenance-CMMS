// app/ui/dashboard/cards.tsx
import { fetchCardData } from '@/app/lib/data';
import {
  ClipboardDocumentListIcon, // Órdenes abiertas
  CheckCircleIcon,           // Órdenes cerradas
  WrenchScrewdriverIcon,     // Solicitudes
  CpuChipIcon,               // Máquinas
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  openOrders: ClipboardDocumentListIcon,
  closedOrders: CheckCircleIcon,
  repairRequests: WrenchScrewdriverIcon,
  machines: CpuChipIcon,
};

export default async function CardWrapper() {
  const {
    openWorkOrdersCount,
    closedWorkOrdersCount,
    repairRequestsCount,
    machinesCount,
  } = await fetchCardData();

  // ✅ AQUÍ va el grid (una sola vez)
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
      <Card title="Órdenes abiertas" value={openWorkOrdersCount} type="openOrders" />
      <Card title="Órdenes cerradas" value={closedWorkOrdersCount} type="closedOrders" />
      <Card title="Solicitudes de reparación" value={repairRequestsCount} type="repairRequests" />
      <Card title="Máquinas" value={machinesCount} type="machines" />
    </div>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'openOrders' | 'closedOrders' | 'repairRequests' | 'machines';
}) {
  const Icon = iconMap[type];

  // ✅ ESTA función solo retorna UNA tarjeta (no grid)
  return (
    <div className="rounded-xl bg-gray-50 p-3 md:p-4">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="text-xs font-medium leading-tight md:text-sm">{title}</h3>
      </div>

      <p
        className={`${lusitana.className} mt-2 truncate rounded-xl bg-white px-3 py-5 text-center text-xl md:px-4 md:py-8 md:text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}





// import { fetchCardData } from '@/app/lib/data';

// import {
//   BanknotesIcon,
//   ClockIcon,
//   UserGroupIcon,
//   InboxIcon,
// } from '@heroicons/react/24/outline';
// import { lusitana } from '@/app/ui/fonts';

// const iconMap = {
//   collected: BanknotesIcon,
//   customers: UserGroupIcon,
//   pending: ClockIcon,
//   invoices: InboxIcon,
// };

// export default async function CardWrapper() {
//   const {
//     numberOfInvoices,
//     numberOfCustomers,
//     totalPaidInvoices,
//     totalPendingInvoices,
//   } = await fetchCardData();
//   return (
//     <>
//       {/* NOTE: Uncomment this code in Chapter 9 */}

//       <Card title="Collected" value={totalPaidInvoices} type="collected" />
//       <Card title="Pending" value={totalPendingInvoices} type="pending" />
//       <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
//       <Card
//         title="Total Customers"
//         value={numberOfCustomers}
//         type="customers"
//       />
//     </>
//   );
// }

// export function Card({
//   title,
//   value,
//   type,
// }: {
//   title: string;
//   value: number | string;
//   type: 'invoices' | 'customers' | 'pending' | 'collected';
// }) {
//   const Icon = iconMap[type];

//   return (
//     <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
//       <div className="flex p-4">
//         {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
//         <h3 className="ml-2 text-sm font-medium">{title}</h3>
//       </div>
//       <p
//         className={`${lusitana.className}
//           truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }
