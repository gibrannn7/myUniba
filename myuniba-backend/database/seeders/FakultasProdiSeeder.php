<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fakultas;
use App\Models\ProgramStudi;

class FakultasProdiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create faculties
        $fakultasList = [
            ['kode_fakultas' => 'FK01', 'nama_fakultas' => 'Fakultas Teknik'],
            ['kode_fakultas' => 'FK02', 'nama_fakultas' => 'Fakultas Ilmu Komputer'],
            ['kode_fakultas' => 'FK03', 'nama_fakultas' => 'Fakultas Ekonomi'],
            ['kode_fakultas' => 'FK04', 'nama_fakultas' => 'Fakultas Kedokteran'],
            ['kode_fakultas' => 'FK05', 'nama_fakultas' => 'Fakultas Hukum'],
        ];

        foreach ($fakultasList as $fakultasData) {
            $fakultas = Fakultas::create($fakultasData);
            
            // Create study programs for each faculty
            $this->createProgramStudi($fakultas->id, $fakultasData['kode_fakultas']);
        }
    }
    
    private function createProgramStudi($fakultasId, $fakultasKode)
    {
        $prodiList = [];
        
        if ($fakultasKode === 'FK01') { // Fakultas Teknik
            $prodiList = [
                ['kode_prodi' => 'FT01', 'nama_prodi' => 'Teknik Informatika', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
                ['kode_prodi' => 'FT02', 'nama_prodi' => 'Teknik Elektro', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
                ['kode_prodi' => 'FT03', 'nama_prodi' => 'Teknik Mesin', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
            ];
        } elseif ($fakultasKode === 'FK02') { // Fakultas Ilmu Komputer
            $prodiList = [
                ['kode_prodi' => 'FI01', 'nama_prodi' => 'Informatika', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
                ['kode_prodi' => 'FI02', 'nama_prodi' => 'Sistem Informasi', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
                ['kode_prodi' => 'FI03', 'nama_prodi' => 'Teknologi Informasi', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
            ];
        } elseif ($fakultasKode === 'FK03') { // Fakultas Ekonomi
            $prodiList = [
                ['kode_prodi' => 'FE01', 'nama_prodi' => 'Manajemen', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
                ['kode_prodi' => 'FE02', 'nama_prodi' => 'Akuntansi', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
            ];
        } elseif ($fakultasKode === 'FK04') { // Fakultas Kedokteran
            $prodiList = [
                ['kode_prodi' => 'FK01', 'nama_prodi' => 'Pendidikan Kedokteran', 'jenjang' => 'S1', 'biaya_pendaftaran' => 350000],
                ['kode_prodi' => 'FK02', 'nama_prodi' => 'Profesi Dokter', 'jenjang' => 'Profesi', 'biaya_pendaftaran' => 350000],
            ];
        } elseif ($fakultasKode === 'FK05') { // Fakultas Hukum
            $prodiList = [
                ['kode_prodi' => 'FH01', 'nama_prodi' => 'Ilmu Hukum', 'jenjang' => 'S1', 'biaya_pendaftaran' => 250000],
            ];
        }
        
        foreach ($prodiList as $prodiData) {
            ProgramStudi::create([
                'fakultas_id' => $fakultasId,
                'kode_prodi' => $prodiData['kode_prodi'],
                'nama_prodi' => $prodiData['nama_prodi'],
                'jenjang' => $prodiData['jenjang'],
                'biaya_pendaftaran' => $prodiData['biaya_pendaftaran'],
            ]);
        }
    }
}
