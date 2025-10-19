import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getExamCard } from '@/services/mahasiswa';

export default function ExamCardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examCard, setExamCard] = useState<any>(null);

  useEffect(() => {
    loadExamCard();
  }, []);

  const loadExamCard = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getExamCard();
      setExamCard(response.exam_card);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data kartu ujian');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat kartu ujian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kartu Ujian</h1>
          <p className="text-gray-600">Kartu ujian untuk ujian semester ini</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gagal Memuat Kartu Ujian</CardTitle>
            <CardDescription>
              Tidak dapat menampilkan kartu ujian Anda saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={loadExamCard}>Coba Lagi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examCard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kartu Ujian</h1>
          <p className="text-gray-600">Kartu ujian untuk ujian semester ini</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kartu Ujian Tidak Tersedia</CardTitle>
            <CardDescription>
              Kartu ujian belum dapat dibuat karena beberapa persyaratan belum terpenuhi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Kartu ujian hanya bisa diakses setelah KRS disetujui dan semua tagihan lunas.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <a href="/akademik/krs">
                <Button variant="outline">Cek Status KRS</Button>
              </a>
              <a href="/keuangan" className="ml-2">
                <Button variant="outline">Cek Status Pembayaran</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kartu Ujian</h1>
        <p className="text-gray-600">Kartu ujian untuk ujian semester ini</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">KARTU UJIAN TENGAH/AKHIR SEMESTER</CardTitle>
          <CardDescription>Universitas Bina Bangsa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-gray-800 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-semibold">NIM:</p>
                <p className="text-lg font-bold border-b-2 border-gray-800 pb-1">{examCard.nim}</p>
              </div>
              <div>
                <p className="font-semibold">Nama:</p>
                <p className="text-lg font-bold border-b-2 border-gray-800 pb-1">{examCard.nama}</p>
              </div>
              <div>
                <p className="font-semibold">Program Studi:</p>
                <p className="text-lg font-bold border-b-2 border-gray-800 pb-1">{examCard.program_studi}</p>
              </div>
              <div>
                <p className="font-semibold">Semester:</p>
                <p className="text-lg font-bold border-b-2 border-gray-800 pb-1">Ganjil 2025/2026</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Daftar Matakuliah</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Kode</TableHead>
                    <TableHead>Nama Matakuliah</TableHead>
                    <TableHead className="text-center">Kelas</TableHead>
                    <TableHead>Dosen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examCard.courses?.map((course: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{course.kode_mk}</TableCell>
                      <TableCell>{course.nama_mk}</TableCell>
                      <TableCell className="text-center">{course.kelas}</TableCell>
                      <TableCell>{course.dosen}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t">
              <div className="text-center">
                <p>Disetujui oleh,</p>
                <div className="h-16"></div>
                <p className="font-semibold underline">Ketua Jurusan</p>
              </div>
              <div className="text-center">
                <p>Dicetak oleh,</p>
                <div className="h-16"></div>
                <p className="font-semibold underline">Mahasiswa</p>
              </div>
              <div className="text-center">
                <p>Diketahui oleh,</p>
                <div className="h-16"></div>
                <p className="font-semibold underline">Dosen PA</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={() => window.print()}>
              Cetak Kartu Ujian
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}