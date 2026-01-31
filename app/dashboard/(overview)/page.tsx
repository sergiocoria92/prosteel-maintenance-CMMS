import CardWrapper from '../../ui/dashboard/cards';
import { lusitana } from '../../ui/fonts';
import { CardsSkeleton } from '../../ui/skeletons';

import PreventiveComplianceChart from '../../ui/dashboard/preventive-compliance-chart';
import DowntimeByMonthChart from '../../ui/dashboard/downtime-by-month-chart';
import SparePartsPareto from '../../ui/dashboard/spare-parts-pareto';
import { Suspense } from 'react';



export default async function Page() {
  return (
    <main>
      {/* Título principal */}
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* ====== CARDS SUPERIORES ======
         Nota:
         - Por ahora NO estoy tocando tu CardWrapper ni tu BD.
         - Solo dejamos este bloque tal cual para no meternos con errores de tablas.
         - Más adelante tú puedes cambiar esas cards a:
           Open Work Orders, Closed Work Orders, Spare Parts Requests, etc.
      */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* ====== ZONA DE GRÁFICOS (como tu dibujo) ======
         Querías 3 gráficos:
         1) Preventive Maintenance Compliance (PMC)
         2) Total Downtime by Month
         3) Spare Parts (pareto / barras horizontales)
         
         IMPORTANTE:
         - Dices que aún no tienes datos.
         - Entonces estos componentes NO consultan BD.
         - Muestran un "placeholder/skeleton" para que el layout ya exista.
      */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 1) Preventive Maintenance Compliance (gráfico grande) */}
        <div className="lg:col-span-8">
          <PreventiveComplianceChart />
        </div>

        {/* 2) Total Downtime by Month */}
        <div className="lg:col-span-4">
          <DowntimeByMonthChart />
        </div>

        {/* 3) Spare Parts Requests (pareto / horizontal) */}
        <div className="lg:col-span-12">
          <SparePartsPareto />
        </div>
      </div>
    </main>
  );
}






// import CardWrapper from '@/app/ui/dashboard/cards';
// import { Card } from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
// import { lusitana } from '@/app/ui/fonts';
// import { fetchCardData } from '@/app/lib/data'; // Remove fetchLatestInvoices
// import { Suspense } from 'react';
// import {
//   RevenueChartSkeleton,
//   LatestInvoicesSkeleton,
//   CardsSkeleton,
// } from '@/app/ui/skeletons';

// export default async function Page() {
//   // const revenue = await fetchRevenue();

//   const {
//     numberOfInvoices,
//     numberOfCustomers,
//     totalPaidInvoices,
//     totalPendingInvoices,
//   } = await fetchCardData();

//   return (
//     <main>
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Dashboard
//       </h1>

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         <Suspense fallback={<CardsSkeleton />}>
//           <CardWrapper />
//         </Suspense>
  
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
//         <Suspense fallback={<RevenueChartSkeleton />}>
//           <RevenueChart />
//         </Suspense>
//         <Suspense fallback={<LatestInvoicesSkeleton />}>
//           <LatestInvoices />
//         </Suspense>
//       </div>
//     </main>
//   );
// }
