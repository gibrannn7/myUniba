import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap } from 'lucide-react';
import { getProdiList, registerPmbStep1 } from '@/services/pmb';

const PMBPage = () => {
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirmation: '',
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    program_studi_id: '',
  });

  // Options
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [virtualAccount, setVirtualAccount] = useState('');

  // Fetch program studi list on component mount
  useEffect(() => {
    const fetchProdiList = async () => {
      try {
        const response = await getProdiList();
        setProdiList(response.data);
      } catch (err) {
        setError('Gagal memuat daftar program studi');
      }
    };

    fetchProdiList();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await registerPmbStep1(formData);
      setVirtualAccount(response.virtual_account);
      setSuccess('Pendaftaran berhasil! Silakan lanjutkan ke pembayaran.');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <GraduationCap className="h-10 w-10 text-indigo-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Pendaftaran Mahasiswa Baru</CardTitle>
            <CardDescription>
              Formulir Pendaftaran Mahasiswa Baru Universitas Bina Bangsa
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

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Langkah {step} dari 3</span>
                <span className="text-sm font-medium">
                  {step === 1 && 'Data Pribadi'}
                  {step === 2 && 'Data Keluarga'}
                  {step === 3 && 'Upload Foto'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Personal Data */}
            {step === 1 && (
              <form onSubmit={handleSubmitStep1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Email</Label>
                    <Input
                      id="username"
                      name="username"
                      type="email"
                      placeholder="email@mahasiswa.com"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                    <Input
                      id="nama_lengkap"
                      name="nama_lengkap"
                      type="text"
                      placeholder="Nama sesuai KTP"
                      value={formData.nama_lengkap}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                    <Input
                      id="tempat_lahir"
                      name="tempat_lahir"
                      type="text"
                      value={formData.tempat_lahir}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                    <Select 
                      name="jenis_kelamin" 
                      value={formData.jenis_kelamin}
                      onValueChange={(value) => setFormData({...formData, jenis_kelamin: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="agama">Agama</Label>
                    <Select
                      name="agama"
                      value={formData.agama}
                      onValueChange={(value) => setFormData({...formData, agama: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih agama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Buddha">Buddha</SelectItem>
                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="program_studi_id">Program Studi</Label>
                    <Select
                      name="program_studi_id"
                      value={formData.program_studi_id}
                      onValueChange={(value) => setFormData({...formData, program_studi_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih program studi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prodiList.map((prodi) => (
                          <SelectItem key={prodi.id} value={prodi.id.toString()}>
                            {prodi.nama_prodi} - {prodi.kode_prodi} (Rp{prodi.biaya_pendaftaran})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Memproses...' : 'Lanjutkan ke Langkah Berikutnya'}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Family Data */}
            {step === 2 && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Informasi Pembayaran</h3>
                  <p className="mb-2">Silakan lakukan pembayaran biaya pendaftaran sebesar <strong>Rp 250,000</strong> ke:</p>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="font-mono text-lg text-center py-2">Virtual Account: <span className="font-bold">{virtualAccount}</span></p>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Setelah melakukan pembayaran, silakan lanjutkan ke langkah berikutnya</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama_ayah">Nama Ayah</Label>
                    <Input id="nama_ayah" placeholder="Nama Ayah" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                    <Input id="pekerjaan_ayah" placeholder="Pekerjaan Ayah" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="penghasilan_ayah">Penghasilan Ayah</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penghasilan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1jt">&lt; Rp 1.000.000</SelectItem>
                        <SelectItem value="1-3jt">Rp 1.000.000 - Rp 3.000.000</SelectItem>
                        <SelectItem value="3-5jt">Rp 3.000.000 - Rp 5.000.000</SelectItem>
                        <SelectItem value=">5jt">&gt; Rp 5.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nama_ibu">Nama Ibu</Label>
                    <Input id="nama_ibu" placeholder="Nama Ibu" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                    <Input id="pekerjaan_ibu" placeholder="Pekerjaan Ibu" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="penghasilan_ibu">Penghasilan Ibu</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penghasilan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1jt">&lt; Rp 1.000.000</SelectItem>
                        <SelectItem value="1-3jt">Rp 1.000.000 - Rp 3.000.000</SelectItem>
                        <SelectItem value="3-5jt">Rp 3.000.000 - Rp 5.000.000</SelectItem>
                        <SelectItem value=">5jt">&gt; Rp 5.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="alamat_orang_tua">Alamat Orang Tua</Label>
                    <textarea 
                      id="alamat_orang_tua" 
                      className="w-full p-2 border rounded-md" 
                      rows={3} 
                      placeholder="Alamat lengkap orang tua"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Kembali</Button>
                  <Button onClick={nextStep}>Lanjutkan ke Upload Foto</Button>
                </div>
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {step === 3 && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Upload Foto Profil</h3>
                  <p className="text-gray-600">Upload foto formal Anda sesuai dengan ketentuan</p>
                </div>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 mb-4" />
                  <p className="text-gray-500 mb-4">Format: JPG/PNG. Maks 2MB</p>
                  <Button variant="outline">Pilih Foto</Button>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Kembali</Button>
                  <Button>Selesai dan Kirim Pendaftaran</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMBPage;