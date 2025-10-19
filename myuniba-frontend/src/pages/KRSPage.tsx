import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAvailableCourses, getCurrentKrs, submitKrs, requestKrsApproval } from '@/services/mahasiswa';

export default function KRSPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [kelas, setKelas] = useState('A');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [currentKrs, setCurrentKrs] = useState<any>(null);
  const [krsStatus, setKrsStatus] = useState<string>('draft'); // draft, pending_approval, approved, rejected
  const [totalSks, setTotalSks] = useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data (current KRS and available courses)
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Get current KRS
      try {
        const krsResponse = await getCurrentKrs();
        if (krsResponse.krs) {
          setCurrentKrs(krsResponse.krs);
          setKrsStatus(krsResponse.krs.status);
          
          // Extract selected course IDs from current KRS
          const selectedIds = krsResponse.krs.krs_details?.map((detail: any) => detail.jadwal_kuliah_id) || [];
          setSelectedCourses(selectedIds);
          
          // Calculate total SKS
          const total = krsResponse.krs.krs_details?.reduce((sum: number, detail: any) => {
            return sum + detail.jadwal_kuliah.mata_kuliah.sks;
          }, 0) || 0;
          setTotalSks(total);
        }
      } catch (err) {
        // No current KRS exists, that's fine
        setKrsStatus('draft');
      }
      
      // Get available courses
      const coursesResponse = await getAvailableCourses(semester, kelas);
      setAvailableCourses(coursesResponse.courses || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (jadwalId: number, sks: number) => {
    if (selectedCourses.includes(jadwalId)) {
      // Remove course
      setSelectedCourses(prev => prev.filter(id => id !== jadwalId));
      setTotalSks(prev => prev - sks);
    } else {
      // Add course
      setSelectedCourses(prev => [...prev, jadwalId]);
      setTotalSks(prev => prev + sks);
    }
  };

  const handleSubmitKrs = async () => {
    if (selectedCourses.length === 0) {
      setError('Pilih setidaknya satu matakuliah');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await submitKrs(selectedCourses);
      
      if (response.krs) {
        setCurrentKrs(response.krs);
        setKrsStatus(response.krs.status);
        setSuccess('KRS berhasil disimpan');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan KRS');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestApproval = async () => {
    if (selectedCourses.length === 0) {
      setError('Pilih setidaknya satu matakuliah');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await requestKrsApproval();
      
      if (response.krs) {
        setCurrentKrs(response.krs);
        setKrsStatus(response.krs.status);
        setSuccess('Permintaan persetujuan KRS berhasil dikirim');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim permintaan persetujuan');
    } finally {
      setLoading(false);
    }
  };

  // Calculate which courses are currently in the KRS
  const currentKrsCourses = currentKrs?.krs_details?.map((detail: any) => detail.jadwal_kuliah) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kartu Rencana Studi (KRS)</h1>
        <p className="text-gray-600">Rencanakan matakuliah yang akan diambil pada semester ini</p>
      </div>

      {/* Status and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Status KRS: <span className={`font-bold ${
            krsStatus === 'approved' ? 'text-green-600' : 
            krsStatus === 'pending_approval' ? 'text-yellow-600' : 
            krsStatus === 'rejected' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {krsStatus === 'draft' && 'DRAFT'}
            {krsStatus === 'pending_approval' && 'MENUNGGU PERSETUJUAN'}
            {krsStatus === 'approved' && 'DISETUJUI'}
            {krsStatus === 'rejected' && 'DITOLAK'}
          </span></CardTitle>
          <CardDescription>
            Pilih matakuliah yang ingin diambil, kemudian kirim untuk disetujui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(Number(e.target.value))}
                className="border rounded p-2"
                disabled={krsStatus !== 'draft'} // Only allow changing before approval
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kelas</label>
              <select 
                value={kelas} 
                onChange={(e) => setKelas(e.target.value)}
                className="border rounded p-2"
                disabled={krsStatus !== 'draft'} // Only allow changing before approval
              >
                {['A', 'B', 'C', 'D'].map(letter => (
                  <option key={letter} value={letter}>Kelas {letter}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Total SKS Terpilih: <span className="font-bold">{totalSks}</span></h3>
                <p className="text-sm text-gray-600">Maksimal 24 SKS per semester</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitKrs} 
                  disabled={loading || krsStatus !== 'draft'}
                >
                  {loading ? 'Menyimpan...' : 'Simpan KRS'}
                </Button>
                <Button 
                  onClick={handleRequestApproval} 
                  disabled={loading || krsStatus !== 'draft' || selectedCourses.length === 0}
                  variant="default"
                >
                  Ajukan Persetujuan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Matakuliah Tersedia</CardTitle>
            <CardDescription>Pilih matakuliah yang ingin diambil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {availableCourses.length > 0 ? (
                availableCourses.map((jadwal) => (
                  <div 
                    key={jadwal.id} 
                    className={`p-4 border rounded-lg ${
                      selectedCourses.includes(jadwal.id) ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`course-${jadwal.id}`}
                        checked={selectedCourses.includes(jadwal.id)}
                        onCheckedChange={() => handleCourseToggle(jadwal.id, jadwal.mata_kuliah.sks)}
                        disabled={krsStatus !== 'draft'}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{jadwal.mata_kuliah.kode_mk} - {jadwal.mata_kuliah.nama_mk}</h3>
                          <span className="font-bold">{jadwal.mata_kuliah.sks} SKS</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p><span className="font-medium">Dosen:</span> {jadwal.dosen.nama_lengkap}</p>
                          <p><span className="font-medium">Hari:</span> {jadwal.hari}, {jadwal.jam_mulai} - {jadwal.jam_selesai}</p>
                          <p><span className="font-medium">Ruang:</span> {jadwal.ruang}</p>
                          <p><span className="font-medium">Kuota:</span> {jadwal.sisa_kuota} / {jadwal.kuota}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Tidak ada matakuliah tersedia untuk semester dan kelas ini</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Matakuliah Terpilih</CardTitle>
            <CardDescription>Matakuliah yang telah dipilih untuk semester ini</CardDescription>
          </CardHeader>
          <CardContent>
            {currentKrsCourses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Matakuliah</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Dosen</TableHead>
                    <TableHead>Hari & Jam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentKrsCourses.map((jadwal: any) => (
                    <TableRow key={jadwal.id}>
                      <TableCell className="font-medium">{jadwal.mata_kuliah.kode_mk}</TableCell>
                      <TableCell>{jadwal.mata_kuliah.nama_mk}</TableCell>
                      <TableCell>{jadwal.mata_kuliah.sks}</TableCell>
                      <TableCell>{jadwal.dosen.nama_lengkap}</TableCell>
                      <TableCell>{jadwal.hari}, {jadwal.jam_mulai} - {jadwal.jam_selesai}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada matakuliah yang dipilih</p>
            )}

            {/* Print buttons */}
            {krsStatus === 'approved' && (
              <div className="mt-6 flex gap-4">
                <Button variant="outline">Cetak KRS</Button>
                <Button variant="outline">Cetak KST</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}