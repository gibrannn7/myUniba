import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDashboardData, recordAttendance } from '@/services/mahasiswa';

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todaysSchedule, setTodaysSchedule] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: string; longitude: string } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    loadTodaysSchedule();
    getCurrentLocation();
  }, []);

  const loadTodaysSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getDashboardData();
      setTodaysSchedule(data.jadwal_hari_ini || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat jadwal hari ini');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // We'll still allow attendance but without location
        }
      );
    }
  };

  const startCamera = () => {
    setCameraActive(true);
    // In a real app, we would access the camera here
    // For now, we'll just simulate camera activation
  };

  const capturePhoto = () => {
    // In a real app, we would capture a photo from the camera
    // For simulation, we'll use a placeholder
    setPhoto('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  };

  const recordAttendanceForClass = async (jadwalId: number) => {
    if (!currentLocation) {
      setError('Lokasi tidak ditemukan. Mohon aktifkan layanan lokasi.');
      return;
    }

    if (!photo) {
      setError('Harap ambil foto sebelum melakukan absensi.');
      return;
    }

    try {
      setIsRecording(true);
      setError('');
      setSuccess('');

      await recordAttendance({
        jadwal_id: jadwalId,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        image_data: photo,
      });

      setSuccess('Absensi berhasil dicatat');
      // Refresh the schedule to update attendance status
      setTimeout(() => {
        loadTodaysSchedule();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Gagal mencatat kehadiran');
    } finally {
      setIsRecording(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat jadwal hari ini...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Absensi</h1>
        <p className="text-gray-600">Lakukan absensi kuliah hari ini</p>
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
          <CardTitle>Jadwal Kuliah Hari Ini</CardTitle>
          <CardDescription>
            Daftar matakuliah yang berlangsung hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysSchedule.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matakuliah</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Ruang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysSchedule.map((jadwal, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {jadwal.mata_kuliah.kode_mk} - {jadwal.mata_kuliah.nama_mk}
                    </TableCell>
                    <TableCell>{jadwal.dosen.nama_lengkap}</TableCell>
                    <TableCell>{jadwal.jam_mulai} - {jadwal.jam_selesai}</TableCell>
                    <TableCell>{jadwal.ruang}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        Belum Absen
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => recordAttendanceForClass(jadwal.id)}
                        disabled={isRecording}
                      >
                        {isRecording ? 'Mencatat...' : 'Absen'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada jadwal kuliah hari ini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Camera Section */}
      <Card>
        <CardHeader>
          <CardTitle>Fitur Absensi Presensi</CardTitle>
          <CardDescription>
            Ambil foto wajah dan lokasi untuk keperluan absensi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Lokasi Saat Ini</h3>
              <div className="p-4 border rounded-lg">
                {currentLocation ? (
                  <div>
                    <p>Lintang: {currentLocation.latitude}</p>
                    <p>Bujur: {currentLocation.longitude}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Lokasi tidak tersedia</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Ambil Foto</h3>
              <div className="p-4 border rounded-lg text-center">
                {photo ? (
                  <div>
                    <img 
                      src={photo} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto border rounded mb-2"
                    />
                    <p className="text-sm text-gray-600">Foto telah diambil</p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center mb-2">
                    <span className="text-gray-500">Pratinjau Kamera</span>
                  </div>
                )}
                <Button onClick={capturePhoto}>
                  {photo ? 'Ambil Ulang Foto' : 'Ambil Foto'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => recordAttendanceForClass(todaysSchedule[0]?.id)}
              disabled={!currentLocation || !photo || isRecording}
            >
              {isRecording ? 'Mencatat Kehadiran...' : 'Rekam Kehadiran Sekarang'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Catatan: Fitur ini menggunakan pengenalan wajah dan lokasi untuk verifikasi kehadiran
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}