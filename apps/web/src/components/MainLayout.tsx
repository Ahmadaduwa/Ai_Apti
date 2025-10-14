import { Outlet } from 'react-router-dom';
import TopNavbar from '@/components/TopNavbar';
import SideNav from '@/components/SideNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNavbar />
      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[15rem,1fr] gap-6">
        <SideNav />
        <main>
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
    </div>
  );
}