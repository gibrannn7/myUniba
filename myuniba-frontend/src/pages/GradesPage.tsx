import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGrades } from '@/services/mahasiswa';

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grades, setGrades] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);

  useEffect(() => {
    loadAvailableSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester !== null) {
      loadGrades(selectedSemester);
    }
  }, [selectedSemester]);

  const loadAvailableSemesters = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For now, let's assume semesters 1-8 are available
      // In a real app, this would come from an API
      setAvailableSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
      
      if (availableSemesters.length > 0) {
        setSelectedSemester(availableSemesters[0]); // Default to first semester
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar semester');
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async (semester: number) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getGrades(semester);
      setGrades(response.grades || []);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data nilai');
    } finally {
      setLoading(false);
    }
  };

  // Calculate IPK and IPS if needed
  const calculateIps = (semesterGrades: any[]) => {
    if (!semesterGrades || semesterGrades.length === 0) return 0.00;
    
    let totalGradePoints = 0;
    let totalSks = 0;
    
    semesterGrades.forEach((khs: any) => {
      if (khs.khs_details) {
        khs.khs_details.forEach((detail: any) => {
          // Convert grade to points (simplified conversion)
          let gradePoint = 0;
          switch(detail.nilai_huruf) {
            case 'A': gradePoint = 4.00; break;
            case 'A-': gradePoint = 3.75; break;
            case 'B+': gradePoint = 3.50; break;
            case 'B': gradePoint = 3.00; break;
            case 'B-': gradePoint = 2.75; break;
            case 'C+': gradePoint = 2.50; break;
            case 'C': gradePoint = 2.00; break;
            case 'C-': gradePoint = 1.75; break;
            case 'D': gradePoint = 1.50; break;
            case 'E': gradePoint = 1.00; break;
            default: gradePoint = 0.00;
          }
          
          totalGradePoints += gradePoint * detail.mata_kuliah.sks;
          totalSks += detail.mata_kuliah.sks;
        });
      }
    });
    
    return totalSks > 0 ? parseFloat((totalGradePoints / totalSks).toFixed(2)) : 0.00;
  };

  if (loading && !grades.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat data nilai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nilai & IPK</h1>
        <p className="text-gray-600">Riwayat nilai dan indeks prestasi Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nilai per Semester</CardTitle>
          <CardDescription>
            Pilih semester untuk melihat nilai pada semester tersebut
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Semester</label>
              <Select 
                value={selectedSemester?.toString()} 
                onValueChange={(value) => setSelectedSemester(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map(semester => (
                    <SelectItem key={semester} value={semester.toString()}>
                      Semester {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-6">
              <Button onClick={() => window.print()}>
                Cetak KHS
              </Button>
            </div>
          </div>

          {grades.length > 0 ? (
            grades.map((khs, index) => (
              <div key={index} className="mb-8">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Tahun Akademik: {khs.tahun_akademik} - Semester {khs.semester}
                    </h3>
                    <div className="text-right">
                      <p className="font-semibold">IPS: {khs.ips || calculateIps([khs])}</p>
                      <p>IPK: {khs.ipk || calculateIps([khs])}</p>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Kode MK</TableHead>
                      <TableHead>Nama Matakuliah</TableHead>
                      <TableHead className="text-center">SKS</TableHead>
                      <TableHead className="text-center">Nilai Huruf</TableHead>
                      <TableHead className="text-center">Nilai Angka</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {khs.khs_details?.map((detail: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{detail.mata_kuliah.kode_mk}</TableCell>
                        <TableCell>{detail.mata_kuliah.nama_mk}</TableCell>
                        <TableCell className="text-center">{detail.mata_kuliah.sks}</TableCell>
                        <TableCell className="text-center">{detail.nilai_huruf}</TableCell>
                        <TableCell className="text-center">{detail.nilai_angka}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 text-right">
                  <p className="font-semibold">
                    Total SKS: {khs.total_sks_semester || (khs.khs_details?.reduce((sum: number, detail: any) => sum + detail.mata_kuliah.sks, 0) || 0)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada data nilai untuk semester yang dipilih</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}