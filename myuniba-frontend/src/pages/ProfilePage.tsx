import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserProfile, updateUserProfile, changePassword } from '@/services/mahasiswa';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profil-pribadi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Personal profile state
  const [personalData, setPersonalData] = useState({
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat_lengkap: '',
    email: '',
    no_whatsapp: '',
  });

  // Family profile state
  const [familyData, setFamilyData] = useState({
    nama_ayah: '',
    pekerjaan_ayah: '',
    penghasilan_ayah: '',
    nama_ibu: '',
    pekerjaan_ibu: '',
    penghasilan_ibu: '',
    alamat_orang_tua: '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setPersonalData({
          nama_lengkap: profile.mahasiswa.nama_lengkap || '',
          tempat_lahir: profile.mahasiswa.tempat_lahir || '',
          tanggal_lahir: profile.mahasiswa.tanggal_lahir || '',
          alamat_lengkap: profile.mahasiswa.alamat_lengkap || '',
          email: profile.mahasiswa.email || '',
          no_whatsapp: profile.mahasiswa.no_whatsapp || '',
        });

        if (profile.keluarga) {
          setFamilyData({
            nama_ayah: profile.keluarga.nama_ayah || '',
            pekerjaan_ayah: profile.keluarga.pekerjaan_ayah || '',
            penghasilan_ayah: profile.keluarga.penghasilan_ayah || '',
            nama_ibu: profile.keluarga.nama_ibu || '',
            pekerjaan_ibu: profile.keluarga.pekerjaan_ibu || '',
            penghasilan_ibu: profile.keluarga.penghasilan_ibu || '',
            alamat_orang_tua: profile.keluarga.alamat_orang_tua || '',
          });
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data profil');
      }
    };

    fetchProfile();
  }, []);

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleFamilyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePersonalProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(personalData);
      setSuccess('Profil pribadi berhasil diperbarui');
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil pribadi');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });
      setSuccess('Password berhasil diubah');
      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil Mahasiswa</h1>
        <p className="text-gray-600">Kelola informasi pribadi dan akun Anda</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profil-pribadi">Profil Pribadi</TabsTrigger>
          <TabsTrigger value="profil-keluarga">Profil Keluarga</TabsTrigger>
          <TabsTrigger value="ganti-password">Ganti Password</TabsTrigger>
        </TabsList>

        {/* Personal Profile Tab */}
        <TabsContent value="profil-pribadi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>
                Informasi dasar tentang diri Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'profil-pribadi' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && activeTab === 'profil-pribadi' && (
                <Alert className="mb-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpdatePersonalProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                    <Input
                      id="nama_lengkap"
                      name="nama_lengkap"
                      value={personalData.nama_lengkap}
                      onChange={handlePersonalDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                    <Input
                      id="tempat_lahir"
                      name="tempat_lahir"
                      value={personalData.tempat_lahir}
                      onChange={handlePersonalDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      type="date"
                      value={personalData.tanggal_lahir}
                      onChange={handlePersonalDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalData.email}
                      onChange={handlePersonalDataChange}
                      readOnly // Email might be read-only in some systems
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                    <Input
                      id="alamat_lengkap"
                      name="alamat_lengkap"
                      value={personalData.alamat_lengkap}
                      onChange={handlePersonalDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="no_whatsapp">No WhatsApp</Label>
                    <Input
                      id="no_whatsapp"
                      name="no_whatsapp"
                      value={personalData.no_whatsapp}
                      onChange={handlePersonalDataChange}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Memperbarui...' : 'Perbarui Profil'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Profile Tab */}
        <TabsContent value="profil-keluarga" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Keluarga</CardTitle>
              <CardDescription>
                Informasi tentang keluarga Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'profil-keluarga' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && activeTab === 'profil-keluarga' && (
                <Alert className="mb-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_ayah">Nama Ayah</Label>
                    <Input
                      id="nama_ayah"
                      name="nama_ayah"
                      value={familyData.nama_ayah}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                    <Input
                      id="pekerjaan_ayah"
                      name="pekerjaan_ayah"
                      value={familyData.pekerjaan_ayah}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="penghasilan_ayah">Penghasilan Ayah</Label>
                    <Input
                      id="penghasilan_ayah"
                      name="penghasilan_ayah"
                      value={familyData.penghasilan_ayah}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nama_ibu">Nama Ibu</Label>
                    <Input
                      id="nama_ibu"
                      name="nama_ibu"
                      value={familyData.nama_ibu}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                    <Input
                      id="pekerjaan_ibu"
                      name="pekerjaan_ibu"
                      value={familyData.pekerjaan_ibu}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="penghasilan_ibu">Penghasilan Ibu</Label>
                    <Input
                      id="penghasilan_ibu"
                      name="penghasilan_ibu"
                      value={familyData.penghasilan_ibu}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="alamat_orang_tua">Alamat Orang Tua</Label>
                    <textarea
                      id="alamat_orang_tua"
                      name="alamat_orang_tua"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={familyData.alamat_orang_tua}
                      onChange={handleFamilyDataChange}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Memperbarui...' : 'Perbarui Profil Keluarga'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Password Tab */}
        <TabsContent value="ganti-password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ganti Password</CardTitle>
              <CardDescription>
                Ubah password akun Anda untuk keamanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'ganti-password' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && activeTab === 'ganti-password' && (
                <Alert className="mb-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Password Saat Ini</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">Password Baru</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password_confirmation">Konfirmasi Password Baru</Label>
                  <Input
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Mengganti...' : 'Ganti Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}