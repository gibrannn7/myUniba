import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBills, getPaymentHistory, setupPaymentPlan } from '@/services/mahasiswa';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('rincian-tagihan');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bills, setBills] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [billsResponse, paymentsResponse] = await Promise.all([
        getBills(),
        getPaymentHistory()
      ]);
      
      setBills(billsResponse.bills || []);
      setPayments(paymentsResponse.payments || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data keuangan');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalUnpaid = () => {
    return bills
      .filter(bill => bill.status === 'belum_dibayar')
      .reduce((sum, bill) => sum + parseFloat(bill.jumlah_tagihan), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat data keuangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keuangan</h1>
        <p className="text-gray-600">Informasi pembayaran dan tagihan Anda</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Total Tagihan Belum Lunas</h2>
            <p className="text-2xl font-bold text-red-600">
              Rp {calculateTotalUnpaid().toLocaleString('id-ID')}
            </p>
          </div>
          <Button>Bayar Sekarang</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rincian-tagihan">Rincian Tagihan</TabsTrigger>
          <TabsTrigger value="riwayat-pembayaran">Riwayat Pembayaran</TabsTrigger>
          <TabsTrigger value="bayar-tagihan">Bayar Tagihan</TabsTrigger>
        </TabsList>

        {/* Billing Details Tab */}
        <TabsContent value="rincian-tagihan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rincian Tagihan</CardTitle>
              <CardDescription>
                Daftar semua tagihan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'rincian-tagihan' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {bills.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Tagihan</TableHead>
                      <TableHead>Tahun Akademik</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Tenggat</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{bill.jenis_tagihan}</TableCell>
                        <TableCell>{bill.tahun_akademik}</TableCell>
                        <TableCell>Rp {parseFloat(bill.jumlah_tagihan).toLocaleString('id-ID')}</TableCell>
                        <TableCell>{new Date(bill.tenggat_waktu).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            bill.status === 'lunas' 
                              ? 'bg-green-100 text-green-800' 
                              : bill.status === 'sebagian_dibayar'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status === 'lunas' ? 'Lunas' : bill.status === 'sebagian_dibayar' ? 'Sebagian Dibayar' : 'Belum Dibayar'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {bill.status !== 'lunas' && (
                            <Button variant="outline" size="sm">Bayar</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data tagihan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="riwayat-pembayaran" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <CardDescription>
                Riwayat pembayaran Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'riwayat-pembayaran' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jenis Tagihan</TableHead>
                      <TableHead>Nomor VA</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(payment.tanggal_pembayaran).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{payment.tagihan?.jenis_tagihan || 'N/A'}</TableCell>
                        <TableCell>{payment.nomor_virtual_account}</TableCell>
                        <TableCell>Rp {parseFloat(payment.jumlah_pembayaran).toLocaleString('id-ID')}</TableCell>
                        <TableCell>{payment.metode_pembayaran}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status_pembayaran === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status_pembayaran === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status_pembayaran === 'success' ? 'Berhasil' : payment.status_pembayaran === 'pending' ? 'Pending' : 'Gagal'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada riwayat pembayaran</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pay Bills Tab */}
        <TabsContent value="bayar-tagihan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bayar Tagihan</CardTitle>
              <CardDescription>
                Lakukan pembayaran tagihan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && activeTab === 'bayar-tagihan' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold mb-2">Pilih Tagihan</h3>
                    {bills
                      .filter(bill => bill.status !== 'lunas')
                      .map((bill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border-b">
                          <div>
                            <p className="font-medium">{bill.jenis_tagihan}</p>
                            <p className="text-sm text-gray-600">Rp {parseFloat(bill.jumlah_tagihan).toLocaleString('id-ID')}</p>
                          </div>
                          <Button variant="outline" size="sm">Pilih</Button>
                        </div>
                      ))}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">Virtual Account BNI</Button>
                      <Button variant="outline" className="w-full justify-start">Virtual Account Mandiri</Button>
                      <Button variant="outline" className="w-full justify-start">Virtual Account BCA</Button>
                      <Button variant="outline" className="w-full justify-start">QRIS</Button>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Rencana Pembayaran</h3>
                      <Button variant="outline" className="w-full">Buat Rencana Cicilan</Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" size="lg">Proses Pembayaran</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}