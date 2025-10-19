<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PmbRegistration;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PmbController extends Controller
{
    /**
     * Get list of available study programs with their registration fees
     */
    public function getProdiList()
    {
        $prodiList = ProgramStudi::with('fakultas')->select('id', 'nama_prodi', 'kode_prodi', 'biaya_pendaftaran', 'fakultas_id')->get();

        return response()->json([
            'data' => $prodiList
        ]);
    }

    /**
     * Store step 1 - Personal data and create user account
     */
    public function storeStep1(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|email|unique:users,username',
            'password' => 'required|string|min:8|confirmed',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|string|max:50',
            'program_studi_id' => 'required|exists:program_studis,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Create user account
            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => 'calon_mahasiswa',
            ]);

            // Create PMB registration record
            $pmbRegistration = PmbRegistration::create([
                'user_id' => $user->id,
                'data_pribadi' => [
                    'nama_lengkap' => $request->nama_lengkap,
                    'tempat_lahir' => $request->tempat_lahir,
                    'tanggal_lahir' => $request->tanggal_lahir,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'agama' => $request->agama,
                    'program_studi_id' => $request->program_studi_id,
                ],
                'status_pendaftaran' => 'mengisi_formulir',
            ]);

            // TODO: Create registration fee invoice
            // For now, we'll just create a dummy invoice
            // In real implementation, this would integrate with payment gateway

            DB::commit();

            return response()->json([
                'message' => 'Step 1 completed successfully',
                'user' => $user,
                'pmb_registration' => $pmbRegistration,
                'virtual_account' => '8888' . $user->id . rand(1000, 9999), // Example virtual account
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to complete step 1',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store step 2 - Family data
     */
    public function storeStep2(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_ayah' => 'required|string|max:255',
            'pekerjaan_ayah' => 'required|string|max:255',
            'penghasilan_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'penghasilan_ibu' => 'required|string|max:255',
            'alamat_orang_tua' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Find the PMB registration for this user
        $pmbRegistration = PmbRegistration::where('user_id', $user->id)->first();

        if (!$pmbRegistration) {
            return response()->json([
                'message' => 'PMB registration not found'
            ], 404);
        }

        // Update the registration with family data
        $pmbRegistration->update([
            'data_keluarga' => [
                'nama_ayah' => $request->nama_ayah,
                'pekerjaan_ayah' => $request->pekerjaan_ayah,
                'penghasilan_ayah' => $request->penghasilan_ayah,
                'nama_ibu' => $request->nama_ibu,
                'pekerjaan_ibu' => $request->pekerjaan_ibu,
                'penghasilan_ibu' => $request->penghasilan_ibu,
                'alamat_orang_tua' => $request->alamat_orang_tua,
            ],
            'status_pendaftaran' => 'menunggu_pembayaran'
        ]);

        return response()->json([
            'message' => 'Step 2 completed successfully',
            'pmb_registration' => $pmbRegistration
        ]);
    }

    /**
     * Upload profile photo
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        $user = $request->user();
        
        // Find the PMB registration for this user
        $pmbRegistration = PmbRegistration::where('user_id', $user->id)->first();

        if (!$pmbRegistration) {
            return response()->json([
                'message' => 'PMB registration not found'
            ], 404);
        }

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('pmb-photos', 'public');
            
            // Update user's profile photo or store in PMB registration
            // For this example, I'll store it in the PMB registration
            $pmbRegistration->update([
                'photo_path' => $photoPath,
            ]);
        }

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo_path' => $photoPath ?? null
        ]);
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(Request $request)
    {
        $user = $request->user();
        
        // Find the PMB registration for this user
        $pmbRegistration = PmbRegistration::where('user_id', $user->id)->first();

        if (!$pmbRegistration) {
            return response()->json([
                'message' => 'PMB registration not found'
            ], 404);
        }

        // In a real implementation, this would integrate with payment gateway to check status
        // For now, returning the current status
        return response()->json([
            'status' => $pmbRegistration->status_pendaftaran,
            'message' => match($pmbRegistration->status_pendaftaran) {
                'mengisi_formulir' => 'Silakan lengkapi formulir pendaftaran',
                'menunggu_pembayaran' => 'Silakan lakukan pembayaran biaya pendaftaran',
                'pembayaran_diverifikasi' => 'Pembayaran sedang diverifikasi',
                'seleksi' => 'Anda sedang dalam proses seleksi',
                'diterima' => 'Selamat! Anda diterima sebagai mahasiswa',
                'ditolak' => 'Maaf, pendaftaran Anda ditolak',
                default => 'Status pendaftaran tidak dikenal'
            }
        ]);
    }
}