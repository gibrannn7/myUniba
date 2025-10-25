import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import backgroundImage from '@/assets/background.jpg';
import logo from '@/assets/logo uniba.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth(); // Ambil fungsi login dari context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(username, password); // Panggil API login

      // Simpan token dan data user ke local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update state di AuthContext
      contextLogin(response.user, response.token);

      // Navigasi berdasarkan role user
      const role = response.user.role;
      console.log('Login successful, user data:', response.user); // Logging untuk debug

      switch (role) {
        case 'mahasiswa':
          console.log('Navigating to /dashboard');
          navigate('/dashboard');
          break;
        case 'dosen':
           console.log('Navigating to /dosen/dashboard');
          navigate('/dosen/dashboard');
          break;
        case 'admin_akademik':
           console.log('Navigating to /admin-akademik/dashboard');
          navigate('/admin-akademik/dashboard');
          break;
        case 'admin_keuangan':
           console.log('Navigating to /admin-keuangan/dashboard');
          navigate('/admin-keuangan/dashboard');
          break;
        case 'lppm':
           console.log('Navigating to /lppm/dashboard');
          navigate('/lppm/dashboard');
          break;
        case 'calon_mahasiswa':
           console.log('Navigating to /pmb');
          navigate('/pmb');
          break;
        default:
           console.log('Navigating to /dashboard (default)');
          navigate('/dashboard'); // Fallback ke dashboard umum
      }
      // Alternatif: Jika navigasi bermasalah, coba reload paksa (kurang ideal)
      // window.location.href = '/dashboard';

    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan periksa kredensial Anda.');
      console.error('Login error:', err); // Logging error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" /> {/* Overlay gelap */}
      <div className="relative w-full max-w-4xl mx-auto">
        <Card className="grid lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-card">
          {/* Kolom Kiri: Logo dan Info (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-indigo-600 p-8 text-white">
             <img src={logo} alt="Logo UNIBA" className="w-40 mb-6" />
            <h2 className="text-3xl font-bold text-center">Selamat Datang Kembali</h2>
            <p className="mt-4 text-center text-indigo-200">
              Silakan login untuk melanjutkan ke myUniba. Portal akademik terintegrasi Universitas Bina Bangsa.
            </p>
             {/* Anda bisa menambahkan pengumuman atau info penting di sini */}
             <div className="mt-8 border-t border-indigo-500 pt-4 w-full max-w-xs">
                <h3 className="text-lg font-semibold mb-2 text-center">Pengumuman</h3>
                <p className="text-sm text-indigo-100 text-center">
                    Jadwal UAS Semester Ganjil akan segera diumumkan.
                </p>
             </div>
          </div>

          {/* Kolom Kanan: Form Login */}
          <div className="p-8">
            <CardHeader className="space-y-1 p-0 mb-6 text-center lg:text-left">
              {/* Logo kecil untuk mobile, disembunyikan di layar besar */}
              <img src={logo} alt="Logo UNIBA" className="w-20 mb-4 mx-auto lg:hidden" />
              <CardTitle className="text-2xl font-semibold">myUniba Login</CardTitle>
              <CardDescription>
                Masukkan NIM/Email dan Password Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md border border-red-300">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">NIM/Email</Label>
                    <Input
                      id="username"
                      placeholder="Masukkan NIM atau Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-input/50" // Sedikit transparan
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-input/50" // Sedikit transparan
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Login'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Belum memiliki akun?{' '}
                <Link to="/register" className="underline text-indigo-600 hover:text-indigo-800 font-medium">
                  Daftar di sini
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}