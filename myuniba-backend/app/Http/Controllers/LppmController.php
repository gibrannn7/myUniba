<?php

namespace App\Http\Controllers;

use App\Models\KkmProgram;
use App\Models\KkmKelompok;
use App\Models\KkmPeserta;
use App\Models\KkmDokumen;
use App\Models\DosenProfile;
use App\Models\MahasiswaProfile;
use Illuminate\Http\Request;

class LppmController extends Controller
{
    // KKM Program Management
    public function getKkmPrograms()
    {
        $programs = KkmProgram::all();
        return response()->json(['programs' => $programs]);
    }

    public function createKkmProgram(Request $request)
    {
        $request->validate([
            'nama_program' => 'required|string|max:255',
            'tahun_akademik' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        $program = KkmProgram::create($request->all());

        return response()->json([
            'message' => 'KKM Program created successfully',
            'program' => $program
        ]);
    }

    public function updateKkmProgram(Request $request, $id)
    {
        $request->validate([
            'nama_program' => 'required|string|max:255',
            'tahun_akademik' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        $program = KkmProgram::findOrFail($id);
        $program->update($request->all());

        return response()->json([
            'message' => 'KKM Program updated successfully',
            'program' => $program
        ]);
    }

    public function deleteKkmProgram($id)
    {
        $program = KkmProgram::findOrFail($id);
        $program->delete();

        return response()->json([
            'message' => 'KKM Program deleted successfully'
        ]);
    }

    // KKM Kelompok Management
    public function getKkmKelompoks()
    {
        $kelompoks = KkmKelompok::with(['kkmProgram', 'dosenPembimbing'])->get();
        return response()->json(['kelompoks' => $kelompoks]);
    }

    public function createKkmKelompok(Request $request)
    {
        $request->validate([
            'kkm_program_id' => 'required|exists:kkm_programs,id',
            'nama_kelompok' => 'required|string|max:255',
            'lokasi_kkm' => 'required|string',
            'dosen_pembimbing_id' => 'required|exists:dosen_profiles,id',
        ]);

        $kelompok = KkmKelompok::create($request->all());

        return response()->json([
            'message' => 'KKM Kelompok created successfully',
            'kelompok' => $kelompok
        ]);
    }

    // KKM Participants Management
    public function addKkmPeserta(Request $request)
    {
        $request->validate([
            'kkm_kelompok_id' => 'required|exists:kkm_kelompoks,id',
            'mahasiswa_profile_id' => 'required|exists:mahasiswa_profiles,id|unique:kkm_pesertas,mahasiswa_profile_id',
        ]);

        $peserta = KkmPeserta::create($request->all());

        return response()->json([
            'message' => 'KKM Peserta added successfully',
            'peserta' => $peserta
        ]);
    }

    public function removeKkmPeserta($id)
    {
        $peserta = KkmPeserta::findOrFail($id);
        $peserta->delete();

        return response()->json([
            'message' => 'KKM Peserta removed successfully'
        ]);
    }

    public function getKkmPesertaByKelompok($kelompok_id)
    {
        $pesertas = KkmPeserta::where('kkm_kelompok_id', $kelompok_id)
            ->with('mahasiswaProfile')
            ->get();
        return response()->json(['pesertas' => $pesertas]);
    }

    // KKM Documents Management
    public function getKkmDokumenByPeserta($peserta_id)
    {
        $dokumens = KkmDokumen::where('kkm_peserta_id', $peserta_id)->get();
        return response()->json(['dokumens' => $dokumens]);
    }

    public function updateKkmDokumenStatus(Request $request, $dokumen_id)
    {
        $request->validate([
            'status' => 'required|in:submitted,approved,revision',
        ]);

        $dokumen = KkmDokumen::findOrFail($dokumen_id);
        $dokumen->status = $request->status;
        $dokumen->save();

        return response()->json([
            'message' => 'KKM Dokumen status updated successfully',
            'dokumen' => $dokumen
        ]);
    }
}