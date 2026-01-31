import { lusitana } from '@/app/ui/fonts';

/**
 * Preventive Maintenance Compliance (PMC)
 * - Este componente NO usa BD todavía.
 * - Solo dibuja el "marco" del gráfico + skeleton bars.
 *
 * Más adelante:
 * - Le pasas data real (por props) o haces un fetch a tu tabla de PMs.
 */
export default function PreventiveComplianceChart() {
  // Meses solo para mostrar la estructura del eje X
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <section className="w-full">
      {/* Título del bloque */}
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Preventive Maintenance Compliance (PMC)
      </h2>

      {/* Card container (igual estilo que el dashboard de Next Learn) */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="rounded-md bg-white p-4">
          {/* Área del gráfico */}
          <div className="grid grid-cols-12 gap-2 items-end">
            {/* Columna izquierda (labels tipo 0%, 20%, etc.) */}
            <div className="hidden sm:flex flex-col justify-between text-sm text-gray-400 h-[320px]">
              <p>100%</p>
              <p>80%</p>
              <p>60%</p>
              <p>40%</p>
              <p>20%</p>
              <p>0%</p>
            </div>

            {/* Barras placeholder (skeleton) */}
            {months.map((m) => (
              <div key={m} className="flex flex-col items-center gap-2">
                {/* Skeleton bar:
                   - animate-pulse da el efecto "cargando"
                   - altura fija para reservar espacio
                   - bg-gray-200 para indicar "sin datos"
                */}
                <div
                  className="w-full rounded-md bg-gray-200 animate-pulse"
                  style={{ height: '260px' }}
                  title="Placeholder (no data yet)"
                />
                <p className="text-xs text-gray-400">{m}</p>
              </div>
            ))}
          </div>

          {/* Nota inferior */}
          <div className="mt-4 text-sm text-gray-500">
            No data yet. This section is reserved for your preventive maintenance compliance chart.
          </div>
        </div>
      </div>
    </section>
  );
}
