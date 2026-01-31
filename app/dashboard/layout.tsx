import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>

      {/* Scroll también en mobile */}
      <div className="grow overflow-y-auto p-4 md:p-12">
        {children}
      </div>
    </div>
  );
}
