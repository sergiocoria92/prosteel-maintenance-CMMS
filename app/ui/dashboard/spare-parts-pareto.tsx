import { lusitana } from '@/app/ui/fonts';

/**
 * Spare Parts Pareto (Top Requests)
 * - Placeholder horizontal "pareto style"
 * - La idea: barras por "parte/categoría" ordenadas desc + % acumulado (después)
 *
 * Por ahora:
 * - NO data real
 * - Solo filas placeholder con barras grises
 */
export default function SparePartsPareto() {
  // Número de filas placeholder (solo UI)
  const rows = Array.from({ length: 6 });

  return (
    <section className="w-full">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Spare Parts Requests (Pareto)
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="rounded-md bg-white p-4">
          {/* Encabezados tipo tabla */}
          <div className="mb-3 grid grid-cols-12 gap-3 text-xs font-medium text-gray-500">
            <div className="col-span-4">Part / Cause</div>
            <div className="col-span-6">Relative Volume</div>
            <div className="col-span-2 text-right">Cumulative %</div>
          </div>

          {/* Filas placeholder */}
          <div className="space-y-3">
            {rows.map((_, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center gap-3">
                {/* Label placeholder */}
                <div className="col-span-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                </div>

                {/* Barra horizontal placeholder */}
                <div className="col-span-6">
                  <div className="h-4 w-full rounded bg-gray-100">
                    <div
                      className="h-4 rounded bg-gray-200 animate-pulse"
                      style={{
                        // Diferentes anchos para "forma" visual (NO data real)
                        width: `${85 - idx * 10}%`,
                      }}
                    />
                  </div>
                </div>

                {/* % acumulado placeholder */}
                <div className="col-span-2 flex justify-end">
                  <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            No data yet. This section is reserved for a pareto view of your spare parts requests.
          </div>
        </div>
      </div>
    </section>
  );
}
