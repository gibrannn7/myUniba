import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '@/services/auth';
import backgroundImage from '@/assets/images/background.jpg';
import logo from '@/assets/images/logo uniba.png';

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
      await register(username, password, 'calon_mahasiswa');
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
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
        <Card className="grid lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl">
          <div className="p-8">
            <CardHeader className="space-y-1 p-0 mb-6">
              <img src={logo} alt="Logo UNIBA" className="w-24 mb-4" />
              <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
              <CardDescription>
                Daftar untuk menjadi calon mahasiswa myUniba.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 text-red-500 text-sm bg-red-100 p-3 rounded-md">
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
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9"
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
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Mendaftar...' : 'Daftar'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Sudah punya akun?{' '}
                <Link to="/login" className="underline text-indigo-600">
                  Login di sini
                </Link>
              </div>
            </CardContent>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center bg-indigo-600 p-8 text-white">
             <img src={logo} alt="Logo UNIBA" className="w-40 mb-6" />
            <h2 className="text-3xl font-bold text-center">Selamat Datang di myUniba</h2>
            <p className="mt-4 text-center text-indigo-200">
              Satu portal untuk semua kebutuhan akademik Anda.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}