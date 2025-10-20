import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '@/services/auth';
import backgroundImage from '@/assets/background.jpg'; // Ganti path jika berbeda
import logo from '@/assets/logo uniba.png'; // Ganti path jika berbeda

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Asumsi role default untuk registrasi awal adalah 'calon_mahasiswa'
      await register(username, password, 'calon_mahasiswa');
      // Beri notifikasi sukses atau langsung redirect
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (err: any) {
      // Tangani error spesifik dari API jika ada (misal: email sudah terdaftar)
      if (err.message && err.message.includes('unique constraint')) {
        setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      } else {
        setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative w-full max-w-4xl mx-auto">
        <Card className="grid lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-card">
          {/* Kolom Kiri: Logo dan Info (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-indigo-600 p-8 text-white">
             <img src={logo} alt="Logo UNIBA" className="w-40 mb-6" />
            <h2 className="text-3xl font-bold text-center">Selamat Datang di myUniba</h2>
            <p className="mt-4 text-center text-indigo-200">
              Satu portal untuk semua kebutuhan akademik Anda. Mulai pendaftaran Anda sekarang.
            </p>
          </div>

          {/* Kolom Kanan: Form Register */}
          <div className="p-8">
            <CardHeader className="space-y-1 p-0 mb-6 text-center lg:text-left">
              <img src={logo} alt="Logo UNIBA" className="w-20 mb-4 mx-auto lg:mx-0 lg:hidden" /> {/* Logo kecil untuk mobile */}
              <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
              <CardDescription>
                Daftar untuk menjadi calon mahasiswa myUniba.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 text-red-500 text-sm bg-red-100 p-3 rounded-md border border-red-300">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Email</Label>
                    <Input
                      id="username"
                      type="email"
                      placeholder="email@contoh.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-input/50"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password (minimal 8 karakter)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-input/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-muted-foreground"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Konfirmasi password Anda"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-input/50"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Mendaftar...' : 'Daftar'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link to="/login" className="underline text-indigo-600 hover:text-indigo-800">
                  Login di sini
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}