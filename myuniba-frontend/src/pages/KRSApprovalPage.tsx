import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getPendingKrs, approveKrs, rejectKrs } from '@/services/dosen';

export default function KRSApprovalPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingKrs, setPendingKrs] = useState<any[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [krsToReject, setKrsToReject] = useState<number | null>(null);

  useEffect(() => {
    loadPendingKrs();
  }, []);

  const loadPendingKrs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getPendingKrs();
      setPendingKrs(response.pending_krs || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data KRS menunggu persetujuan');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (krsId: number) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await approveKrs(krsId);
      setSuccess('KRS berhasil disetujui');
      
      // Refresh the list
      setTimeout(() => {
        loadPendingKrs();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyetujui KRS');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (krsId: number) => {
    setKrsToReject(krsId);
    setRejectReason('');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Alasan penolakan harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await rejectKrs(krsToReject!, rejectReason);
      setSuccess('KRS berhasil ditolak');
      setKrsToReject(null);
      setRejectReason('');
      
      // Refresh the list
      setTimeout(() => {
        loadPendingKrs();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Gagal menolak KRS');
    } finally {
      setLoading(false);
    }
  };

  if (loading && pendingKrs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat KRS menunggu persetujuan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Persetujuan KRS</h1>
        <p className="text-gray-600">Verifikasi dan setujui KRS mahasiswa bimbingan Anda</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>KRS Menunggu Persetujuan</CardTitle>
          <CardDescription>
            Daftar KRS dari mahasiswa yang perlu disetujui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingKrs.length > 0 ? (
            <div className="space-y-6">
              {pendingKrs.map((krs) => (
                <Card key={krs.id} className="border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {krs.mahasiswa_profile.nama_lengkap} - {krs.mahasiswa_profile.nim}
                        </CardTitle>
                        <CardDescription>
                          Program Studi: {krs.mahasiswa_profile.program_studi.nama_prodi}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Total SKS: {krs.total_sks}</p>
                        <p className="text-sm text-gray-600">Tahun Akademik: {krs.tahun_akademik}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Daftar Matakuliah:</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kode MK</TableHead>
                            <TableHead>Nama Matakuliah</TableHead>
                            <TableHead>SKS</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Dosen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {krs.krs_details?.map((detail: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{detail.jadwal_kuliah.mata_kuliah.kode_mk}</TableCell>
                              <TableCell>{detail.jadwal_kuliah.mata_kuliah.nama_mk}</TableCell>
                              <TableCell>{detail.jadwal_kuliah.mata_kuliah.sks}</TableCell>
                              <TableCell>{detail.jadwal_kuliah.kelas}</TableCell>
                              <TableCell>{detail.jadwal_kuliah.dosen.nama_lengkap}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleRejectClick(krs.id)}
                      >
                        Tolak
                      </Button>
                      <Button 
                        onClick={() => handleApprove(krs.id)}
                      >
                        Setujui
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada KRS menunggu persetujuan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Reason Modal */}
      {krsToReject && (
        <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-full">
          <CardHeader>
            <CardTitle>Alasan Penolakan</CardTitle>
            <CardDescription>
              Masukkan alasan mengapa KRS ini ditolak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Masukkan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setKrsToReject(null);
                    setRejectReason('');
                  }}
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Tolak KRS'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}