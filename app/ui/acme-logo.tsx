// app/ui/acme-logo.tsx
// ✅ Change "Cumbre" -> "CMMS"
// This component is what renders the big brand text in the blue box.

import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <p className={`${lusitana.className} text-[44px] leading-none md:text-[64px]`}>
      CMMS
    </p>
  );
}
