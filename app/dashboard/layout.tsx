import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      {/* Sidebar: angosto en móvil, normal en md+ */}
      <div className="w-20 flex-none md:w-64">
        <SideNav />
      </div>

      {/* Contenido */}
      <div className="grow overflow-y-auto p-4 md:p-12">{children}</div>
    </div>
  );
}
