// app/ui/acme-logo.tsx
// ✅ Change "Cumbre" -> "CMMS"
// This component is what renders the big brand text in the blue box.

import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div className="w-full text-center font-serif text-3xl leading-none text-white md:text-5xl">
      CMMS
    </div>
  );
}

