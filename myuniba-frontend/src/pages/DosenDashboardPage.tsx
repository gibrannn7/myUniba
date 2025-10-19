import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDosenDashboard } from '@/services/dosen';

export default function DosenDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getDosenDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Dosen</h1>
        <p className="text-gray-600">Ringkasan aktivitas mengajar dan tugas Anda</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jadwal Mengajar Hari Ini</CardTitle>
            <CardDescription>Mata kuliah yang akan diajar</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.jadwal_hari_ini && dashboardData.jadwal_hari_ini.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.jadwal_hari_ini.map((jadwal: any, index: number) => (
                  <div key={index} className="p-3 border rounded-md">
                    <p className="font-semibold">{jadwal.mata_kuliah.nama_mk}</p>
                    <p className="text-sm text-gray-600">{jadwal.hari}, {jadwal.jam_mulai} - {jadwal.jam_selesai}</p>
                    <p className="text-sm">Ruang: {jadwal.ruang}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada jadwal mengajar hari ini</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mahasiswa Bimbingan</CardTitle>
            <CardDescription>Jumlah mahasiswa dalam bimbingan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData?.mahasiswa_bimbingan_count || 0}</p>
            <p className="text-gray-600 mt-2">Tugas sebagai dosen pembimbing KKM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">KRS Menunggu Persetujuan</CardTitle>
            <CardDescription>KRS dari mahasiswa yang perlu disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dashboardData?.pending_krs_count || 0}</p>
            <p className="text-gray-600 mt-2">
              <a href="/dosen/krs-approval" className="text-blue-600 hover:underline">
                Lihat daftar KRS
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal Mengajar Minggu Ini</CardTitle>
          <CardDescription>Rencana mengajar Anda dalam seminggu ke depan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Matakuliah</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Ruang</TableHead>
                <TableHead>Kelas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Senin</TableCell>
                <TableCell>Algoritma dan Struktur Data</TableCell>
                <TableCell>08:00 - 10:00</TableCell>
                <TableCell>A101</TableCell>
                <TableCell>A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Selasa</TableCell>
                <TableCell>Pemrograman Web</TableCell>
                <TableCell>10:30 - 12:30</TableCell>
                <TableCell>A202</TableCell>
                <TableCell>B</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Kamis</TableCell>
                <TableCell>Algoritma dan Struktur Data</TableCell>
                <TableCell>13:00 - 15:00</TableCell>
                <TableCell>A101</TableCell>
                <TableCell>B</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}