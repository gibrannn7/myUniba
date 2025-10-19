import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  GraduationCap, 
  DollarSign, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { logout } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];
    
    switch(user.role) {
      case 'mahasiswa':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Profil', href: '/profile', icon: Users },
          { name: 'Akademik', href: '/akademik', icon: GraduationCap },
          { name: 'Keuangan', href: '/keuangan', icon: DollarSign },
          { name: 'Absensi', href: '/absensi', icon: GraduationCap },
        ];
      case 'dosen':
        return [
          { name: 'Dashboard', href: '/dosen/dashboard', icon: LayoutDashboard },
          { name: 'Jadwal Mengajar', href: '/dosen/jadwal', icon: GraduationCap },
          { name: 'Input Nilai', href: '/dosen/input-nilai', icon: GraduationCap },
          { name: 'Persetujuan KRS', href: '/dosen/krs-approval', icon: Settings },
        ];
      case 'admin_akademik':
        return [
          { name: 'Dashboard', href: '/admin-akademik/dashboard', icon: LayoutDashboard },
          { name: 'Manajemen Mahasiswa', href: '/admin-akademik/mahasiswa', icon: Users },
          { name: 'Manajemen Dosen', href: '/admin-akademik/dosen', icon: Users },
          { name: 'Manajemen Mata Kuliah', href: '/admin-akademik/mata-kuliah', icon: GraduationCap },
          { name: 'Penjadwalan', href: '/admin-akademik/penjadwalan', icon: Settings },
        ];
      case 'admin_keuangan':
        return [
          { name: 'Dashboard', href: '/admin-keuangan/dashboard', icon: LayoutDashboard },
          { name: 'Manajemen Tagihan', href: '/admin-keuangan/tagihan', icon: DollarSign },
          { name: 'Verifikasi Pembayaran', href: '/admin-keuangan/verifikasi', icon: Settings },
          { name: 'Laporan Keuangan', href: '/admin-keuangan/laporan', icon: DollarSign },
        ];
      case 'lppm':
        return [
          { name: 'Dashboard', href: '/lppm/dashboard', icon: LayoutDashboard },
          { name: 'Manajemen KKM', href: '/lppm/kkm', icon: GraduationCap },
          { name: 'Laporan', href: '/lppm/laporan', icon: Settings },
        ];
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full z-30 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">myUniba</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 group transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    {sidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full mt-4"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {user?.role.replace('_', ' ')}
              </span>
              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-dashed" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Universitas Bina Bangsa. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;