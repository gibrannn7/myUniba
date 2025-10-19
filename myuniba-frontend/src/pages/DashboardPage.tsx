import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di sistem myUniba, {user?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jadwal Hari Ini</CardTitle>
            <CardDescription>Mata kuliah yang akan berlangsung</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 Kelas</p>
            <p className="text-sm text-gray-500">Tidak ada jadwal hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tagihan Belum Lunas</CardTitle>
            <CardDescription>Total pembayaran yang harus diselesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Rp0</p>
            <p className="text-sm text-gray-500">Tidak ada tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">IPK Terakhir</CardTitle>
            <CardDescription>Indeks Prestasi Kumulatif</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0.00</p>
            <p className="text-sm text-gray-500">Belum tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Akademik</CardTitle>
            <CardDescription>Kondisi akademik terkini</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{user?.role}</p>
            <p className="text-sm text-gray-500">Aktif</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aktivitas</CardTitle>
          <CardDescription>Aktivitas akademik terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada aktivitas terbaru</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}