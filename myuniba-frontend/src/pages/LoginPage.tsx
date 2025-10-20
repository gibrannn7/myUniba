import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';
import backgroundImage from '@/assets/background.jpg'; // Import background image
import logo from '@/assets/logo uniba.png'; // Import logo

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      const role = response.user.role;
      switch (role) {
        case 'mahasiswa':
          navigate('/dashboard');
          break;
        case 'dosen':
          navigate('/dosen/dashboard');
          break;
        case 'admin_akademik':
          navigate('/admin-akademik/dashboard');
          break;
        case 'admin_keuangan':
          navigate('/admin-keuangan/dashboard');
          break;
        case 'lppm':
          navigate('/lppm/dashboard');
          break;
        case 'calon_mahasiswa':
          navigate('/pmb');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan periksa kredensial Anda.');
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
              Silakan login untuk melanjutkan ke myUniba.
            </p>
             {/* Tambahkan info atau pengumuman di sini jika perlu */}
          </div>

          {/* Kolom Kanan: Form Login */}
          <div className="p-8">
            <CardHeader className="space-y-1 p-0 mb-6 text-center lg:text-left">
              <img src={logo} alt="Logo UNIBA" className="w-20 mb-4 mx-auto lg:mx-0 lg:hidden" /> {/* Logo kecil untuk mobile */}
              <CardTitle className="text-2xl">myUniba Login</CardTitle>
              <CardDescription>
                Masukkan NIM/Email dan Password Anda
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
                    <Label htmlFor="username">NIM/Email</Label>
                    <Input
                      id="username"
                      placeholder="Masukkan NIM atau Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-input/50"
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
                      className="bg-input/50"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Belum memiliki akun?{' '}
                <Link to="/register" className="underline text-indigo-600 hover:text-indigo-800">
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