'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Heroicons (outline) para el menú lateral
import {
  HomeIcon,
  ClipboardDocumentListIcon, // Work Orders
  CubeIcon,                  // Inventory
  WrenchScrewdriverIcon,     // Spare Parts Requests
} from '@heroicons/react/24/outline';

/**
 * Links del SideNav.
 * - name: texto visible (inglés)
 * - href: ruta a la que navega
 * - icon: ícono
 *
 * IMPORTANTE:
 * - Si todavía NO existen esas páginas (/dashboard/work-orders, etc.),
 *   al dar click te dará 404. Eso es normal hasta que las crees.
 * - Aquí solo estamos armando el menú y su estilo.
 */
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },

  // Nuevo: Ordenes de trabajo
  { name: 'Work Orders', href: '/dashboard/work-orders', icon: ClipboardDocumentListIcon },

  // Nuevo: Inventario
  { name: 'Inventory', href: '/dashboard/inventory', icon: CubeIcon },

  // Nuevo: Solicitud de refacción
  { name: 'Spare Parts Requests', href: '/dashboard/spare-parts-requests', icon: WrenchScrewdriverIcon },
];

export default function NavLinks() {
  // pathname = ruta actual (ej. "/dashboard", "/dashboard/invoices", etc.)
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        /**
         * ACTIVE LOGIC (importante para que no se pinte mal):
         * - Para "Home" solo es activo cuando EXACTAMENTE estás en "/dashboard"
         * - Para los demás, puede ser activo también si estás en una subruta:
         *   ej. "/dashboard/work-orders/123" debe marcar "Work Orders" como activo.
         */
        const isActive =
          pathname === link.href ||
          (link.href !== '/dashboard' && pathname.startsWith(link.href));

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              /**
               * ESTILO BASE (aplica a TODOS):
               * - bg gris clarito
               * - texto oscuro
               * - hover: fondo azul claro + texto azul
               * - focus-visible: accesibilidad (tecla TAB)
               */
              'group flex h-[48px] grow items-center justify-center gap-2 rounded-md ' +
                'bg-gray-50 p-3 text-sm font-medium text-gray-900 ' +
                'hover:bg-sky-100 hover:text-blue-600 ' +
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
                'md:flex-none md:justify-start md:p-2 md:px-3',

              /**
               * ESTILO ACTIVE (cuando es la ruta actual):
               * - se queda en azul claro y texto azul
               */
              {
                'bg-sky-100 text-blue-600': isActive,
              },
            )}
          >
            {/* Ícono:
               - w-6 = tamaño consistente
               - text-gray-900 en normal; si el link está activo/hover, hereda el color del link
            */}
            <LinkIcon className="w-6" />

            {/* Texto:
               - En móvil se oculta (para ahorrar espacio), en md+ se muestra.
            */}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}






// 'use client';

// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import clsx from 'clsx';

// // Map of links to display in the side navigation.
// // Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon },
//   {
//     name: 'Invoices',
//     href: '/dashboard/invoices',
//     icon: DocumentDuplicateIcon,
//   },
//   { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
// ];

// export default function NavLinks() {
//   const pathname = usePathname();
//   return (
    
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;
//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
//               {
//                 'bg-sky-100 text-blue-600': pathname === link.href,
//               },
//             )}
//           >
//             <LinkIcon className="w-6" />
//             <p className="hidden md:block">{link.name}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }
