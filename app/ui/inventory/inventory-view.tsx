'use client';

// app/ui/inventory/inventory-view.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import type { Consumable, InventoryItem, LinkedConsumable } from '@/app/lib/definitions';

type Props = {
  initialType: string;
  initialQuery: string;

  // Tabs normales (machine/aux/tool/spare)
  items: InventoryItem[];

  // Tab "Consumable" (catálogo global)
  consumables: Consumable[];

  // Catálogo global (para modal y sección global)
  allConsumables: Consumable[];

  // Consumibles ligados por item (para View(n) y modal)
  consumablesByItemId: Record<string, LinkedConsumable[]>;
};

const TABS = [
  { key: 'machine', label: 'Machine' },
  { key: 'auxiliary', label: 'Auxiliary Equipment' },
  { key: 'tool', label: 'Tool' },
  { key: 'spare_part', label: 'Spare Part' },
  { key: 'consumable', label: 'Consumable' }, // catálogo global
] as const;

const STATUS_OPTIONS = [
  { value: 'working', label: 'Working' },
  { value: 'repairing', label: 'Repairing' },
  { value: 'down', label: 'Down' },
] as const;

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
] as const;

function PencilIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
    </svg>
  );
}

function StatusPillWithPencil({ value }: { value: string }) {
  const v = value || 'working';
  const base = 'rounded-full px-2.5 py-1 text-xs font-semibold';
  const cls =
    v === 'down'
      ? 'border border-red-200 bg-red-50 text-red-700'
      : v === 'repairing'
        ? 'border border-yellow-200 bg-yellow-50 text-yellow-700'
        : 'border border-green-200 bg-green-50 text-green-700';

  return (
    <span className="inline-flex items-center gap-2">
      <span className={clsx(base, cls)}>{v}</span>
      {/* lápiz SOLO decorativo (sin función) */}
      <button
        type="button"
        disabled
        title="Edit later"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </span>
  );
}

function TextWithPencil({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-gray-700">{text}</span>
      {/* lápiz SOLO decorativo (sin función) */}
      <button
        type="button"
        disabled
        title="Edit later"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function InventoryView({
  initialType,
  initialQuery,
  items,
  consumables,
  allConsumables,
  consumablesByItemId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);

  const [openLinkedModalForItemId, setOpenLinkedModalForItemId] = useState<string | null>(
    null,
  );

  // ADD MODAL
  const [openAddModal, setOpenAddModal] = useState(false);

  function updateUrl(next: { type?: string; q?: string }) {
    const params = new URLSearchParams(sp?.toString());

    if (typeof next.type === 'string') params.set('type', next.type);
    if (typeof next.q === 'string') params.set('q', next.q);
    if (!params.get('q')) params.delete('q');

    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      updateUrl({ q: query, type });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type]);

  const currentTabLabel = useMemo(() => {
    return TABS.find((t) => t.key === type)?.label ?? 'Machine';
  }, [type]);

  const isConsumableTab = type === 'consumable';
  const linkedConsumables = openLinkedModalForItemId
    ? consumablesByItemId[openLinkedModalForItemId] ?? []
    : [];

  return (
    <section className="space-y-4">
      {/* TOP BAR */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xl">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search in Inventory
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${currentTabLabel}...`}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: Try “laser”, “shop”, “VIN1013”, “PN-1001”, etc.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAddModal(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 md:self-end"
        >
          <span className="text-lg leading-none">+</span>
          Add
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setType(t.key)}
            className={clsx(
              'rounded-md border px-3 py-2 text-sm',
              t.key === type
                ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE AREA */}
      <div className="rounded-lg border border-gray-100 bg-white p-3 md:p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{currentTabLabel}</h2>

          <span className="text-xs text-gray-500">
            Records: {isConsumableTab ? consumables.length : items.length}
          </span>
        </div>

        {/* EMPTY */}
        {isConsumableTab ? (
          consumables.length === 0 ? (
            <EmptyState />
          ) : (
            <ConsumablesCatalogTable consumables={consumables} />
          )
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <InventoryItemsTable
            items={items}
            type={type}
            consumablesByItemId={consumablesByItemId}
            onOpenLinked={(id) => setOpenLinkedModalForItemId(id)}
          />
        )}
      </div>

      {/* MODAL: Linked Consumables (solo para items) */}
      {!isConsumableTab && openLinkedModalForItemId && (
        <Modal onClose={() => setOpenLinkedModalForItemId(null)}>
          <h3 className="text-base font-semibold text-gray-900">Linked Consumables</h3>
          <p className="mt-1 text-sm text-gray-600">
            This list is coming from Postgres (table: inventory_item_consumables).
          </p>

          <div className="mt-4 space-y-2">
            {linkedConsumables.length === 0 ? (
              <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                No consumables linked yet.
              </div>
            ) : (
              linkedConsumables.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md border border-gray-100 p-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">Part #: {c.part_number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Qty used: {c.qty_used ?? 0}</div>
                    <div className="text-xs text-gray-400">{c.description ?? ''}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Catálogo global (preview) */}
          <div className="mt-6 rounded-md border border-gray-100 bg-white p-3">
            <div className="text-sm font-semibold text-gray-900">
              Available consumables (global)
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {allConsumables.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  className="rounded-md border border-gray-100 bg-gray-50 p-2 text-xs text-gray-700"
                >
                  {c.part_number} — {c.name} (qty: {c.qty ?? 0})
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              (Showing a few. Later you can add full picker.)
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL: Add */}
      {openAddModal && (
        <AddInventoryModal
          defaultType={type}
          allConsumables={allConsumables}
          onClose={() => setOpenAddModal(false)}
          onSaved={() => {
            setOpenAddModal(false);
            router.refresh();
          }}
        />
      )}
    </section>
  );
}

function InventoryItemsTable({
  items,
  type,
  consumablesByItemId,
  onOpenLinked,
}: {
  items: InventoryItem[];
  type: string;
  consumablesByItemId: Record<string, LinkedConsumable[]>;
  onOpenLinked: (id: string) => void;
}) {
  // Spare Part NO debe mostrar "Consumables" (y tampoco los cuenta)
  const hideConsumablesColumn = type === 'spare_part';

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="p-2">VIN</th>
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Date Added</th>
            <th className="p-2">Status</th>
            {!hideConsumablesColumn && <th className="p-2">Consumables</th>}
            <th className="p-2">Photo</th>
          </tr>
        </thead>

        <tbody>
          {items.map((it) => {
            const anyIt = it as any;
            const dateAdded = anyIt.date_added ?? anyIt.created_at ?? anyIt.year_installed ?? null;

            return (
              <tr key={it.id} className="border-b border-gray-50">
                <td className="p-2">
                  <div className="font-medium text-gray-900">{it.vin}</div>
                  <div className="text-xs text-gray-500">Qty: {it.qty ?? 1}</div>
                </td>

                <td className="p-2 text-gray-700">{it.name}</td>
                <td className="p-2 text-gray-700">{it.location}</td>

                <td className="p-2 text-gray-700">
                  {dateAdded ? String(dateAdded).slice(0, 10) : '—'}
                </td>

                {/* STATUS: fijo en la tabla + lápiz decorativo */}
                <td className="p-2">
                  <StatusPillWithPencil value={String(it.status ?? 'working')} />
                </td>

                {/* CONSUMABLES (solo si NO es spare_part) */}
                {!hideConsumablesColumn && (
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => onOpenLinked(it.id)}
                      className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      View ({(consumablesByItemId[it.id] ?? []).length})
                    </button>
                  </td>
                )}

                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 rounded-md border border-dashed border-gray-200 bg-gray-50" />
                    <span className="text-xs text-gray-500">
                      {it.photo_url ? it.photo_url : 'no-photo-yet'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ConsumablesCatalogTable({ consumables }: { consumables: Consumable[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="p-2">Part #</th>
            <th className="p-2">Name</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Date Added</th>
            <th className="p-2">Status</th>
            <th className="p-2">Condition</th>
            <th className="p-2">Request</th>
          </tr>
        </thead>

        <tbody>
          {consumables.map((c) => {
            const anyC = c as any;
            const dateAdded = anyC.date_added ?? anyC.created_at ?? null;

            return (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="p-2">
                  <div className="font-medium text-gray-900">{c.part_number}</div>
                </td>

                <td className="p-2 text-gray-700">
                  <div>{c.name}</div>
                  {c.description ? (
                    <div className="text-xs text-gray-500">{c.description}</div>
                  ) : null}
                </td>

                <td className="p-2 text-gray-700">{c.qty ?? 0}</td>

                <td className="p-2 text-gray-700">
                  {dateAdded ? String(dateAdded).slice(0, 10) : '—'}
                </td>

                {/* STATUS: fijo en la tabla + lápiz decorativo */}
                <td className="p-2">
                  <StatusPillWithPencil value={String(anyC.status ?? 'working')} />
                </td>

                {/* CONDITION: fijo en la tabla + lápiz decorativo */}
                <td className="p-2">
                  <TextWithPencil text={String(anyC.condition ?? 'new')} />
                </td>

                <td className="p-2">
                  <button
                    type="button"
                    onClick={() =>
                      alert('Coming soon: Request (will open Spare Parts Request prefilled).')
                    }
                    className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Request
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   ADD MODAL
   ========================= */

function AddInventoryModal({
  defaultType,
  allConsumables,
  onClose,
  onSaved,
}: {
  defaultType: string;
  allConsumables: Consumable[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type selector dentro del modal
  const [formType, setFormType] = useState<
    'machine' | 'auxiliary' | 'tool' | 'spare_part' | 'consumable'
  >((defaultType as any) || 'machine');

  // General fields (inventory_items)
  const [vin, setVin] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [dateAdded, setDateAdded] = useState<string>(''); // YYYY-MM-DD

  // Status (EN MODAL sí se puede editar para machine/aux/tool/spare_part)
  const [status, setStatus] = useState<'working' | 'repairing' | 'down'>('working');

  // Consumable catalog fields (consumables table)
  const [partNumber, setPartNumber] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<'new' | 'used'>('new');

  // Photo (solo UI por ahora)
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const isConsumable = formType === 'consumable';
  const isSparePart = formType === 'spare_part';

  // Spare Part: NO debe ver sección "Consumables"
  const canLinkConsumables = !isConsumable && !isSparePart;

  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      if (isConsumable) {
        if (!partNumber.trim() || !name.trim()) {
          throw new Error('Part # and Name are required.');
        }

        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'consumable',
            part_number: partNumber.trim(),
            name: name.trim(),
            description: description.trim() || null,
            qty: Number.isFinite(qty) ? qty : 0,
            date_added: dateAdded || null,
            // estos campos te sirven después (si tu DB los tiene)
            status,
            condition,
            // foto todavía no se guarda (solo UI)
            photo_url: null,
          }),
        });

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error ?? 'Failed to save consumable.');
        }

        onSaved();
        return;
      }

      // inventory_items
      if (!vin.trim() || !name.trim() || !location.trim()) {
        throw new Error('VIN, Name and Location are required.');
      }

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'inventory_item',
          type: formType,
          vin: vin.trim(),
          name: name.trim(),
          location: location.trim(),
          qty: Number.isFinite(qty) ? qty : 1,
          date_added: dateAdded || null,
          status, // EN MODAL editable
          // foto todavía no se guarda (solo UI)
          photo_url: null,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? 'Failed to save item.');
      }

      onSaved();
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Add</h3>
          <p className="mt-1 text-sm text-gray-600">
            Select the article type. The form will adapt automatically.
          </p>
        </div>

        {/* Type selector + Status (EN MODAL editable; sin lápiz) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Article</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value as any)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="machine">Machine</option>
              <option value="auxiliary">Auxiliary Equipment</option>
              <option value="tool">Tool</option>
              <option value="spare_part">Spare Part</option>
              <option value="consumable">Consumable</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Added */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date Added</label>
          <input
            type="date"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        {/* Photo upload (solo UI) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              {photoFile ? `Selected: ${photoFile.name}` : 'No file selected.'}
              <span className="ml-2">(Upload/DB save later)</span>
            </div>
          </div>
        </div>

        {/* Form body */}
        {isConsumable ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Part #</label>
              <input
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="PN-1001"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hydraulic Oil ISO 46"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Qty</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            {/* Condition EN MODAL: editable (New/Used) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">VIN</label>
              <input
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="VIN1013"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Laser Cutter"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Shop / Warehouse / Tool Room"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Qty</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                (You can keep 1 for machines/tools if you want.)
              </p>
            </div>

            {/* Consumables linking - SOLO UI, y SOLO para machine/aux/tool (NO spare_part) */}
            {canLinkConsumables ? (
              <div className="md:col-span-2">
                <div className="mb-1 text-sm font-medium text-gray-700">Consumables</div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                  Coming soon: picker to link consumables with qty_used.
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    {allConsumables.slice(0, 4).map((c) => (
                      <div key={c.id} className="rounded-md bg-white p-2 text-xs text-gray-700">
                        {c.part_number} — {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ========================= */

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-6">
      <div className="text-sm font-semibold text-gray-900">No records yet</div>
      <p className="mt-1 text-sm text-gray-600">
        This section is ready. Once you seed or insert data, items will show here.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="h-16 rounded-md bg-white shadow-sm" />
        <div className="h-16 rounded-md bg-white shadow-sm" />
        <div className="h-16 rounded-md bg-white shadow-sm" />
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">{children}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



// 'use client';

// // app/ui/inventory/inventory-view.tsx

// /**
//  * INVENTORY VIEW (Client Component)
//  *
//  * Comentarios (ES):
//  * - Este componente corre en el navegador (cliente).
//  * - Aquí hacemos todo lo interactivo:
//  *   1) Buscador general
//  *   2) Botón verde "+"
//  *   3) Tabs
//  *   4) Tabla con: VIN, Name, Location, Year, Status, Consumables, Photo
//  *   5) Modal para mostrar consumibles ligados al item
//  *
//  * Nota (ES):
//  * - Por ahora NO guardamos cambios de status en la DB.
//  * - Más adelante lo conectas con Server Actions o API routes.
//  */

// import React, { useEffect, useMemo, useState } from 'react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import clsx from 'clsx';

// // Comentarios (ES):
// // - Estos tipos DEBEN existir en app/lib/definitions.ts (los arreglamos arriba).
// import type { Consumable, InventoryItem, LinkedConsumable } from '@/app/lib/definitions';

// type Props = {
//   initialType: string;
//   initialQuery: string;
//   items: InventoryItem[];
//   allConsumables: Consumable[];
//   consumablesByItemId: Record<string, LinkedConsumable[]>;
// };

// const TABS = [
//   { key: 'machine', label: 'Machine' },
//   { key: 'auxiliary', label: 'Auxiliary Equipment' },
//   { key: 'tool', label: 'Tool' },
//   { key: 'spare_part', label: 'Spare Part' },
//   { key: 'consumable', label: 'Consumable' },
// ] as const;

// const STATUS_OPTIONS = [
//   { value: 'working', label: 'Working' },
//   { value: 'repairing', label: 'Repairing' },
//   { value: 'down', label: 'Down' },
// ] as const;

// export default function InventoryView({
//   initialType,
//   initialQuery,
//   items,
//   allConsumables,
//   consumablesByItemId,
// }: Props) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const sp = useSearchParams();

//   // Comentarios (ES):
//   // - Controlamos el input localmente y lo reflejamos en la URL (?type=...&q=...)
//   const [query, setQuery] = useState(initialQuery);
//   const [type, setType] = useState(initialType);

//   // Modal state (qué item está abierto)
//   const [openModalForItemId, setOpenModalForItemId] = useState<string | null>(null);

//   // Comentarios (ES):
//   // - Guardamos status localmente SOLO para UI, sin persistir.
//   const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

//   useEffect(() => {
//     // Comentarios (ES):
//     // - Inicializamos el status local basado en lo que venga de DB.
//     const map: Record<string, string> = {};
//     for (const it of items) map[it.id] = it.status ?? 'working';
//     setLocalStatus(map);
//   }, [items]);

//   function updateUrl(next: { type?: string; q?: string }) {
//     // Comentarios (ES):
//     // - Partimos de los params actuales
//     // - Luego sobreescribimos type/q
//     const params = new URLSearchParams(sp?.toString());

//     if (typeof next.type === 'string') params.set('type', next.type);
//     if (typeof next.q === 'string') params.set('q', next.q);

//     // Comentarios (ES):
//     // - Si q está vacío, lo borramos para una URL limpia
//     if (!params.get('q')) params.delete('q');

//     router.replace(`${pathname}?${params.toString()}`);
//   }

//   // Comentarios (ES):
//   // - Debounce simple: espera 350ms antes de actualizar URL.
//   useEffect(() => {
//     const t = setTimeout(() => {
//       updateUrl({ q: query, type });
//     }, 350);

//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query, type]);

//   const currentTabLabel = useMemo(() => {
//     return TABS.find((t) => t.key === type)?.label ?? 'Machine';
//   }, [type]);

//   const modalConsumables = openModalForItemId
//     ? consumablesByItemId[openModalForItemId] ?? []
//     : [];

//   return (
//     <section className="space-y-4">
//       {/* ============ TOP BAR: search + add button ============ */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div className="w-full md:max-w-xl">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Search in Inventory
//           </label>

//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder={`Search in ${currentTabLabel}...`}
//             className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Tip: Try “laser”, “shop”, “VIN1001”, “working”, etc.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => alert('Coming soon: create new inventory item')}
//           className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 md:self-end"
//         >
//           <span className="text-lg leading-none">+</span>
//           Add
//         </button>
//       </div>

//       {/* ============ TABS ============ */}
//       <div className="flex flex-wrap gap-2">
//         {TABS.map((t) => (
//           <button
//             key={t.key}
//             type="button"
//             onClick={() => setType(t.key)}
//             className={clsx(
//               'rounded-md border px-3 py-2 text-sm',
//               t.key === type
//                 ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700'
//                 : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
//             )}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ============ TABLE AREA ============ */}
//       <div className="rounded-lg border border-gray-100 bg-white p-3 md:p-4">
//         <div className="mb-3 flex items-center justify-between">
//           <h2 className="text-base font-semibold text-gray-900">
//             {currentTabLabel}
//           </h2>

//           <span className="text-xs text-gray-500">Records: {items.length}</span>
//         </div>

//         {items.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-[900px] w-full border-collapse text-sm">
//               <thead>
//                 <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                   <th className="p-2">VIN</th>
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Location</th>
//                   <th className="p-2">Year</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Consumables</th>
//                   <th className="p-2">Photo</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {items.map((it) => (
//                   <tr key={it.id} className="border-b border-gray-50">
//                     <td className="p-2 font-medium text-gray-900">{it.vin}</td>
//                     <td className="p-2 text-gray-700">{it.name}</td>
//                     <td className="p-2 text-gray-700">{it.location}</td>

//                     {/* Comentarios (ES):
//                         - Antes tenías it.year_installed (NO existe).
//                         - En tu data.ts estás trayendo year_added.
//                     */}
//                     <td className="p-2 text-gray-700">{it.year_added ?? '—'}</td>

//                     {/* STATUS (dropdown) */}
//                     <td className="p-2">
//                       <select
//                         value={localStatus[it.id] ?? 'working'}
//                         onChange={(e) =>
//                           setLocalStatus((prev) => ({
//                             ...prev,
//                             [it.id]: e.target.value,
//                           }))
//                         }
//                         className="w-[140px] rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
//                       >
//                         {STATUS_OPTIONS.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>

//                       {/* Comentarios (ES):
//                           - Aquí podrías agregar botón “Save” luego.
//                       */}
//                     </td>

//                     {/* CONSUMABLES (modal trigger) */}
//                     <td className="p-2">
//                       <button
//                         type="button"
//                         onClick={() => setOpenModalForItemId(it.id)}
//                         className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50"
//                       >
//                         View ({(consumablesByItemId[it.id] ?? []).length})
//                       </button>
//                     </td>

//                     {/* PHOTO (placeholder) */}
//                     <td className="p-2">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-16 rounded-md border border-dashed border-gray-200 bg-gray-50" />
//                         <span className="text-xs text-gray-500">
//                           {it.photo_url ? it.photo_url : 'no-photo-yet'}
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ============ MODAL ============ */}
//       {openModalForItemId && (
//         <Modal onClose={() => setOpenModalForItemId(null)}>
//           <h3 className="text-base font-semibold text-gray-900">
//             Linked Consumables
//           </h3>
//           <p className="mt-1 text-sm text-gray-600">
//             This list is coming from Postgres (table: inventory_item_consumables).
//           </p>

//           <div className="mt-4 space-y-2">
//             {modalConsumables.length === 0 ? (
//               <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
//                 No consumables linked yet.
//               </div>
//             ) : (
//               modalConsumables.map((c) => (
//                 <div
//                   key={c.id}
//                   className="flex items-center justify-between rounded-md border border-gray-100 p-3"
//                 >
//                   <div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       {c.name}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Part #: {c.part_number}
//                     </div>
//                   </div>

//                   {/* Comentarios (ES):
//                       - Antes tenías c.description (NO existe en tu modelo).
//                       - Lo correcto con tu query es mostrar qty_used.
//                   */}
//                   <span className="text-xs font-semibold text-gray-700">
//                     Qty used: {c.qty_used}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="mt-6 rounded-md border border-gray-100 bg-white p-3">
//             <div className="text-sm font-semibold text-gray-900">
//               Available consumables (global)
//             </div>
//             <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
//               {allConsumables.slice(0, 6).map((c) => (
//                 <div
//                   key={c.id}
//                   className="rounded-md border border-gray-100 bg-gray-50 p-2 text-xs text-gray-700"
//                 >
//                   {c.part_number} — {c.name} (qty: {c.qty})
//                 </div>
//               ))}
//             </div>
//             <p className="mt-2 text-xs text-gray-500">
//               (Showing a few. Later you can add full picker.)
//             </p>
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-6">
//       <div className="text-sm font-semibold text-gray-900">No records yet</div>
//       <p className="mt-1 text-sm text-gray-600">
//         This section is ready. Once you seed or insert inventory data, items will show here.
//       </p>

//       <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
//         <div className="h-16 rounded-md bg-white shadow-sm" />
//         <div className="h-16 rounded-md bg-white shadow-sm" />
//         <div className="h-16 rounded-md bg-white shadow-sm" />
//       </div>
//     </div>
//   );
// }

// function Modal({
//   children,
//   onClose,
// }: {
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="w-full max-w-2xl rounded-lg bg-white p-4 md:p-6"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-start justify-between gap-4">
//           <div className="min-w-0 flex-1">{children}</div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


