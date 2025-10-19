import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';

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
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on user role
      const role = response.user.role;
      switch(role) {
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
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">myUniba Login</CardTitle>
          <CardDescription className="text-center">
            Masukkan NIM/Email dan Password Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 text-red-600 text-sm">
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Belum memiliki akun? <a href="/register" className="text-indigo-600 hover:underline">Daftar di sini</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}