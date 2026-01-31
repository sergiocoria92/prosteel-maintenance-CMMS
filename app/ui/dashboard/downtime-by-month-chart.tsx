import { lusitana } from '@/app/ui/fonts';

/**
 * Total Downtime by Month
 * - Placeholder vertical chart
 * - Luego lo conectas a tus eventos de downtime (work orders cerradas, paros, etc.)
 */
export default function DowntimeByMonthChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <section className="w-full">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Total Downtime by Month
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="rounded-md bg-white p-4">
          {/* Área del gráfico */}
          <div className="flex items-end justify-between gap-3 h-[320px]">
            {months.map((m) => (
              <div key={m} className="flex flex-col items-center gap-2 w-full">
                {/* Skeleton bar con alturas diferentes solo para "mostrar forma",
                    pero NO es data real (solo UI placeholder). */}
                <div
                  className="w-full rounded-md bg-gray-200 animate-pulse"
                  style={{
                    height: `${180 + (m.charCodeAt(0) % 80)}px`,
                  }}
                  title="Placeholder (no data yet)"
                />
                <p className="text-xs text-gray-400">{m}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            No data yet. This section is reserved for total downtime per month.
          </div>
        </div>
      </div>
    </section>
  );
}
