// app/ui/dashboard/sidenav.tsx
// ✅ Changes requested:
// 1) Move "Sign Out" directly under "Spare Parts Requests" (NavLinks).
// 2) Add a professional footer line UNDER the sign out button with copyright.
// 3) Change the top logo text from "Cumbre" to "CMMS" (done in acme-logo.tsx below).

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* ===== Top Brand / Logo ===== */}
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {/* ===== Main navigation area =====
          Important:
          - "NavLinks" stays at the top.
          - We REMOVED the big spacer div that was pushing Sign Out to the bottom.
          - Now Sign Out will appear directly under the last nav item.
      */}
      <div className="flex grow flex-col space-y-2">
        {/* Navigation links */}
        <NavLinks />

        {/* ===== Sign Out button (now directly under the links) ===== */}
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </form>

        {/* ===== Footer / Credit line =====
            Professional style, small, subtle.
            Stays under the sign out button.
        */}
        <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
          © {currentYear} Developed by Sergio Coria Maya. All rights reserved.
        </div>

        {/* Optional: if you still want empty space below everything, use flex-grow */}
        <div className="grow" />
      </div>
    </div>
  );
}




// import Link from 'next/link';
// import NavLinks from '@/app/ui/dashboard/nav-links';
// import AcmeLogo from '@/app/ui/acme-logo';
// import { PowerIcon } from '@heroicons/react/24/outline';
// import { signOut } from '@/auth';

// export default function SideNav() {
//   return (
//     <div className="flex h-full flex-col px-3 py-4 md:px-2">
//       <Link
//         className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
//         href="/"
//       >
//         <div className="w-32 text-white md:w-40">
//           <AcmeLogo />
//         </div>
//       </Link>
//       <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
//         <NavLinks />
//         <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
//         <form
//           action={async () => {
//             'use server';
//             await signOut({ redirectTo: '/' });
//           }}
//         >
//           <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
//             <PowerIcon className="w-6" />
//             <div className="hidden md:block">Sign Out</div>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
