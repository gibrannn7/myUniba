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
  X,
  BookUser, // Ganti ikon profil jika perlu
  BookOpenCheck, // Ganti ikon akademik jika perlu
  ReceiptText, // Ganti ikon keuangan jika perlu
  CalendarCheck, // Ganti ikon absensi jika perlu
  FileText, // Ikon untuk laporan
  CalendarDays, // Ikon jadwal mengajar
  ClipboardCheck, // Ikon input nilai
  CheckSquare, // Ikon persetujuan KRS
  Building, // Ikon Manajemen Mhs/Dosen/dll
  ListChecks, // Ikon Manajemen Tagihan
  BadgeCheck, // Ikon Verifikasi Pembayaran
  Landmark, // Ikon Laporan Keuangan
  NotebookText, // Ikon Manajemen KKM
} from 'lucide-react';
import { logout as logoutService } from '@/services/auth'; // Rename import
import { useNavigate, Link } from 'react-router-dom';
import logoUniba from '@/assets/logo uniba.png'; // Import logo

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout: authLogout } = useAuth(); // Ambil fungsi logout dari context
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutService(); // Panggil logout service dari API
    } catch (error) {
      console.error("API logout failed:", error);
      // Tetap lanjutkan proses logout di frontend meskipun API gagal
    } finally {
      await authLogout(); // Panggil fungsi logout dari AuthContext
      navigate('/login'); // Redirect ke login
    }
  };

  // Definisikan item navigasi berdasarkan peran pengguna
  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'mahasiswa':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Profil', href: '/profile', icon: BookUser },
          { name: 'Akademik', href: '/akademik', icon: BookOpenCheck }, // Sub-menu mungkin diperlukan
          { name: 'Keuangan', href: '/keuangan', icon: ReceiptText },
          { name: 'Absensi', href: '/absensi', icon: CalendarCheck },
        ];
      case 'dosen':
        return [
          { name: 'Dashboard', href: '/dosen/dashboard', icon: LayoutDashboard },
          { name: 'Jadwal Mengajar', href: '/dosen/jadwal', icon: CalendarDays },
          { name: 'Input Nilai', href: '/dosen/input-nilai', icon: ClipboardCheck },
          { name: 'Persetujuan KRS', href: '/dosen/krs-approval', icon: CheckSquare },
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
          { name: 'Manajemen Tagihan', href: '/admin-keuangan/tagihan', icon: ListChecks },
          { name: 'Verifikasi Pembayaran', href: '/admin-keuangan/verifikasi', icon: BadgeCheck },
          { name: 'Laporan Keuangan', href: '/admin-keuangan/laporan', icon: Landmark },
        ];
      case 'lppm':
        return [
          { name: 'Dashboard', href: '/lppm/dashboard', icon: LayoutDashboard },
          { name: 'Manajemen KKM', href: '/lppm/kkm', icon: NotebookText },
          { name: 'Laporan', href: '/lppm/laporan', icon: FileText },
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
        className={`bg-card text-card-foreground shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full z-30 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src={logoUniba} alt="Logo myUniba" className="h-8 w-auto" /> {/* Logo */}
              <span className="text-xl font-bold">myUniba</span>
            </Link>
          )}
          {!sidebarOpen && (
             <img src={logoUniba} alt="Logo myUniba" className="h-8 w-auto mx-auto" /> /* Logo kecil saat collapsed */
          )}
           <button
            onClick={toggleSidebar}
            className={`p-1 rounded-md hover:bg-accent ${sidebarOpen ? '' : 'absolute top-4 right-4'}`} // Posisi tombol toggle
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center p-3 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground group transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                    {sidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="flex-shrink-0">
               {/* Placeholder avatar */}
               <div className="bg-muted border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center text-muted-foreground">
                 {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
               </div>
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{user?.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4"
              size="sm"
            >
              Logout
            </Button>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header (Optional, bisa dihapus jika tidak perlu header terpisah) */}
        {/*
        <header className="bg-card shadow-sm z-10 border-b border-border">
          <div className="flex items-center justify-between p-4 h-16">
            <div/> // Spacer
            <div className="flex items-center space-x-4">
               // Konten header jika ada, misal notifikasi, dll.
            </div>
          </div>
        </header>
        */}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-4">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Universitas Bina Bangsa. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;