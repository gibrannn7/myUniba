import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getMyClasses, getClassStudents, submitGrades } from '@/services/dosen';

export default function GradeInputPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [gradeInputs, setGradeInputs] = useState<Record<number, { nilai_huruf: string; nilai_angka: number }>>({});

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudentsForClass(selectedClass);
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getMyClasses();
      setClasses(response.classes || []);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data kelas');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsForClass = async (classId: number) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getClassStudents(classId);
      setStudents(response.students || []);
      
      // Initialize grade inputs
      const initialInputs: Record<number, { nilai_huruf: string; nilai_angka: number }> = {};
      response.students?.forEach((student: any) => {
        initialInputs[student.id] = {
          nilai_huruf: student.current_grade?.nilai_huruf || 'A',
          nilai_angka: student.current_grade?.nilai_angka || 4.0
        };
      });
      setGradeInputs(initialInputs);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data mahasiswa');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId: number, type: 'nilai_huruf' | 'nilai_angka', value: string | number) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value
      }
    }));
  };

  const handleSubmitGrades = async () => {
    if (!selectedClass) {
      setError('Pilih kelas terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare grades data
      const gradesData = students.map(student => ({
        student_id: student.id,
        nilai_huruf: gradeInputs[student.id]?.nilai_huruf || 'A',
        nilai_angka: parseFloat(gradeInputs[student.id]?.nilai_angka.toString()) || 4.0
      }));

      await submitGrades({
        class_id: selectedClass,
        grades: gradesData
      });

      setSuccess('Nilai berhasil disimpan');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan nilai');
    } finally {
      setLoading(false);
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Input Nilai</h1>
        <p className="text-gray-600">Input dan kelola nilai mahasiswa</p>
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
          <CardTitle>Pilih Kelas</CardTitle>
          <CardDescription>
            Pilih kelas untuk menginput nilai mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Kelas yang Diampu</label>
            <Select 
              value={selectedClass?.toString()} 
              onValueChange={(value) => setSelectedClass(Number(value))}
            >
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.mata_kuliah.kode_mk} - {cls.mata_kuliah.nama_mk} (Kelas {cls.kelas})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && students.length > 0 ? (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {classes.find(c => c.id === selectedClass)?.mata_kuliah.nama_mk} - Kelas {classes.find(c => c.id === selectedClass)?.kelas}
                </h3>
                <Button onClick={handleSubmitGrades} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Nilai'}
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama Mahasiswa</TableHead>
                    <TableHead className="text-center">Nilai Huruf</TableHead>
                    <TableHead className="text-center">Nilai Angka</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.nim}</TableCell>
                      <TableCell>{student.nama}</TableCell>
                      <TableCell>
                        <Select 
                          value={gradeInputs[student.id]?.nilai_huruf || 'A'}
                          onValueChange={(value) => handleGradeChange(student.id, 'nilai_huruf', value)}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="C+">C+</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="C-">C-</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          step="0.01"
                          value={gradeInputs[student.id]?.nilai_angka || 4.0}
                          onChange={(e) => handleGradeChange(student.id, 'nilai_angka', parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : selectedClass && students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada mahasiswa dalam kelas ini</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}