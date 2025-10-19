<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\MahasiswaProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminKeuanganController extends Controller
{
    // Generate bills for semester
    public function generateBills(Request $request)
    {
        $request->validate([
            'tahun_akademik' => 'required|string',
            'jenis_tagihan' => 'required|string',
            'jumlah_tagihan' => 'required|numeric',
            'tenggat_waktu' => 'required|date',
            'program_studi_ids' => 'required|array',
            'program_studi_ids.*' => 'exists:program_studis,id',
        ]);

        DB::beginTransaction();

        try {
            // Get all students in the specified programs
            $students = MahasiswaProfile::whereIn('program_studi_id', $request->program_studi_ids)->get();

            $createdBills = [];
            foreach ($students as $student) {
                $bill = Tagihan::create([
                    'mahasiswa_profile_id' => $student->id,
                    'tahun_akademik' => $request->tahun_akademik,
                    'jenis_tagihan' => $request->jenis_tagihan,
                    'jumlah_tagihan' => $request->jumlah_tagihan,
                    'tenggat_waktu' => $request->tenggat_waktu,
                    'status' => 'belum_dibayar',
                ]);

                $createdBills[] = $bill;
            }

            DB::commit();

            return response()->json([
                'message' => count($createdBills) . ' bills generated successfully',
                'bills' => $createdBills
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to generate bills',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get all bills
    public function getBills()
    {
        $bills = Tagihan::with(['mahasiswaProfile', 'pembayarans'])->get();
        return response()->json(['bills' => $bills]);
    }

    // Get bills by status
    public function getBillsByStatus($status)
    {
        $bills = Tagihan::where('status', $status)
            ->with(['mahasiswaProfile', 'pembayarans'])
            ->get();
        return response()->json(['bills' => $bills]);
    }

    // Verify manual payment
    public function verifyPayment(Request $request, $pembayaran_id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:success,failed',
            'keterangan' => 'nullable|string',
        ]);

        $pembayaran = Pembayaran::findOrFail($pembayaran_id);
        $pembayaran->status_pembayaran = $request->status_pembayaran;
        $pembayaran->keterangan = $request->keterangan;
        $pembayaran->save();

        // Update the related bill status
        if ($pembayaran->tagihan) {
            $bill = $pembayaran->tagihan;
            if ($request->status_pembayaran === 'success') {
                $bill->status = 'lunas';
            }
            $bill->save();
        }

        return response()->json([
            'message' => 'Payment verified successfully',
            'pembayaran' => $pembayaran->load(['tagihan', 'mahasiswaProfile'])
        ]);
    }

    // Get payment history
    public function getPaymentHistory()
    {
        $payments = Pembayaran::with(['mahasiswaProfile', 'tagihan'])->get();
        return response()->json(['payments' => $payments]);
    }

    // Get payment history for a specific student
    public function getStudentPaymentHistory($mahasiswa_id)
    {
        $payments = Pembayaran::where('mahasiswa_profile_id', $mahasiswa_id)
            ->with('tagihan')
            ->get();
        return response()->json(['payments' => $payments]);
    }
}