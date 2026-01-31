// app/dashboard/inventory/page.tsx
import InventoryView from '@/app/ui/inventory/inventory-view';
import {
  fetchAllConsumables,
  fetchConsumablesForItem,
  fetchFilteredConsumables,
  fetchInventoryItems,
} from '@/app/lib/data';

export default async function InventoryPage({
  searchParams,
}: {
  searchParams?: { type?: string; q?: string };
}) {
  const type = searchParams?.type ?? 'machine';
  const q = searchParams?.q ?? '';

  // Siempre cargamos catálogo global (se usa en modal + sección "Available consumables")
  const allConsumables = await fetchAllConsumables();

  // TAB "Consumable" = catálogo global (NO inventory_items type=consumable)
  if (type === 'consumable') {
    const consumables = await fetchFilteredConsumables(q);

    return (
      <main className="p-4 md:p-6">
        <h1 className="mb-4 text-xl md:text-2xl font-semibold">Inventory</h1>

        <InventoryView
          initialType={type}
          initialQuery={q}
          items={[]}
          consumables={consumables}
          allConsumables={allConsumables}
          consumablesByItemId={{}}
        />
      </main>
    );
  }

  // Otros tabs = inventory_items por tipo
  const items = await fetchInventoryItems({ q, type });

  // Map para mostrar View(n) y contenido del modal
  const entries = await Promise.all(
    items.map(async (it) => [it.id, await fetchConsumablesForItem(it.id)] as const),
  );

  const consumablesByItemId = Object.fromEntries(entries);

  return (
    <main className="p-4 md:p-6">
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Inventory</h1>

      <InventoryView
        initialType={type}
        initialQuery={q}
        items={items}
        consumables={[]}
        allConsumables={allConsumables}
        consumablesByItemId={consumablesByItemId}
      />
    </main>
  );
}


// // app/dashboard/inventory/page.tsx
// import { lusitana } from '@/app/ui/fonts';
// import InventoryView from '@/app/ui/inventory/inventory-view';
// import {
//   fetchInventoryItems,
//   fetchAllConsumables,
//   fetchConsumablesForItem,
// } from '@/app/lib/data';

// export default async function InventoryPage({
//   searchParams,
// }: {
//   searchParams?: { q?: string; type?: string };
// }) {
//   // Comentarios (ES):
//   // - q = texto del buscador
//   // - type = tab seleccionado
//   const q = searchParams?.q ?? '';
//   const type = searchParams?.type ?? 'machine';

//   const items = await fetchInventoryItems({ q, type });
//   const allConsumables = await fetchAllConsumables();

//   // Comentarios (ES):
//   // - Armamos un diccionario: { [itemId]: LinkedConsumable[] }
//   const entries = await Promise.all(
//     items.map(async (item) => {
//       const linked = await fetchConsumablesForItem(item.id);
//       return [item.id, linked] as const;
//     }),
//   );

//   const consumablesByItemId = Object.fromEntries(entries);

//   return (
//     <main className="p-4 md:p-6">
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Inventory</h1>

//       <InventoryView
//         initialType={type}
//         initialQuery={q}
//         items={items}
//         allConsumables={allConsumables}
//         consumablesByItemId={consumablesByItemId}
//       />
//     </main>
//   );
// }
