-- ====================================================================
-- DATABASE KANG DIKIN (Kelola Lingkungan, Sadar Iklim, Kesejahteraan Terintegrasi)
-- Format: MySQL / MariaDB (Kompatibel dengan XAMPP & phpMyAdmin)
-- Dibuat: 2026-09-20
-- ====================================================================
-- --------------------------------------------------------
-- 1. TABEL PENGGUNA / ADMINISTRATOR
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'staff', 'public') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
('usr-admin-01', 'Administrator KANG DIKIN', 'admin@kangdikin.desa.id', 'admin123', 'admin'),
('usr-staff-01', 'Kader Lingkungan Desa', 'kader@kangdikin.desa.id', 'kader123', 'staff');

-- --------------------------------------------------------
-- 2. TABEL KATEGORI PROGRAM
-- --------------------------------------------------------
DROP TABLE IF EXISTS `program_categories`;
CREATE TABLE `program_categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `color` VARCHAR(50) DEFAULT 'emerald',
  `created_at` DATE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `program_categories` (`id`, `name`, `description`, `color`, `created_at`) VALUES
('cat-sampah', 'Pengelolaan Sampah', 'Pilar sirkularitas reduksi sampah kering, anorganik, dan daur ulang warga.', 'emerald', '2026-01-01'),
('cat-hutan-bukan-kayu', 'Hasil Hutan Bukan Kayu', 'Pemberdayaan agroforestri aren, getah, dan komoditas nabati non-tebang.', 'amber', '2026-01-01'),
('cat-kehutanan', 'Kehutanan Masyarakat', 'Penanaman kayu keras sengon/mahoni, reboisasi, dan tebang pilih lestari.', 'stone', '2026-01-01'),
('cat-organik', 'Organik & Sirkular', 'Biokonversi sampah sisa dapur, maggot BSF, dan pupuk kompos hayati.', 'teal', '2026-01-01'),
('cat-sosial', 'Kesejahteraan & Sosial', 'Program pemberdayaan ekonomi dan bantuan ketahanan pangan masyarakat.', 'blue', '2026-01-01'),
('cat-energi', 'Energi Terbarukan', 'Inisiatif biogas komunal, panel surya skala warga, dan briket biomassa.', 'purple', '2026-01-01');

-- --------------------------------------------------------
-- 3. TABEL PROGRAM
-- --------------------------------------------------------
DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'Recycle',
  `image` TEXT,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_public` TINYINT(1) DEFAULT 1,
  `category` VARCHAR(100),
  `color` VARCHAR(50) DEFAULT 'emerald',
  `created_at` DATE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `programs` (`id`, `name`, `slug`, `description`, `icon`, `image`, `is_active`, `is_public`, `category`, `color`, `created_at`) VALUES
('prog-bank-sampah', 'Bank Sampah', 'bank-sampah', 'Pengelolaan, pemilahan, dan pencatatan tabungan sampah kering, kardus, plastik, dan daur ulang masyarakat.', 'Recycle', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80', 1, 1, 'Pengelolaan Sampah', 'emerald', '2026-01-01'),
('prog-aren', 'Aren', 'aren', 'Pencatatan kegiatan budidaya aren, penyadapan nira lestari, produksi gula semut, dan konservasi sabuk hijau lereng.', 'Leaf', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', 1, 1, 'Hasil Hutan Bukan Kayu', 'amber', '2026-01-15'),
('prog-kayu', 'Kayu Rakyat', 'kayu', 'Pencatatan pembibitan pohon keras, penanaman reboisasi, panen kayu bersertifikat lestari, dan olahan kayu warga.', 'Trees', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', 1, 1, 'Kehutanan Masyarakat', 'stone', '2026-02-01'),
('prog-kompos-maggot', 'Kompos & Maggot BSF', 'kompos-maggot', 'Pemberdayaan biokonversi sampah dapur dengan larva Black Soldier Fly (BSF) dan produksi pupuk organik kasgot bermutu tinggi.', 'Sprout', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', 1, 1, 'Organik & Sirkular', 'teal', '2026-02-10'),
('prog-minyak-jelantah', 'Sedekah Jelantah', 'sedekah-jelantah', 'Pengumpulan limbah minyak goreng bekas rumah tangga dan warung untuk dikonversi menjadi biosolar dan sabun cuci ramah lingkungan.', 'Droplets', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80', 1, 1, 'Pengelolaan Sampah', 'orange', '2026-02-20'),
('prog-kebun-gizi', 'Kebun Gizi Warga', 'kebun-gizi', 'Pemanfaatan pekarangan dan pupuk kasgot untuk tanaman sayur, buah, dan apotek hidup penunjang ketahanan pangan keluarga.', 'HeartHandshake', 'https://images.unsplash.com/photo-1592417817098-8f3d69106a8e?auto=format&fit=crop&w=600&q=80', 1, 1, 'Kesejahteraan & Sosial', 'blue', '2026-03-01');

-- --------------------------------------------------------
-- 4. TABEL RUKUN WARGA (RW)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rws`;
CREATE TABLE `rws` (
  `id` VARCHAR(50) NOT NULL,
  `number` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `leader` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `rws` (`id`, `number`, `name`, `status`, `leader`) VALUES
('rw-01', '01', 'Dusun Karang Asri', 'active', 'Bpk. H. Supardi'),
('rw-02', '02', 'Dusun Sukamaju', 'active', 'Ibu Hj. Siti Aminah'),
('rw-03', '03', 'Dusun Mekar Wangi', 'active', 'Bpk. Hendra Gunawan'),
('rw-04', '04', 'Dusun Wana Kencana', 'active', 'Bpk. Bambang Sutrisno'),
('rw-05', '05', 'Dusun Tirta Kencana', 'active', 'Ibu Nurhayati');

-- --------------------------------------------------------
-- 5. TABEL RUKUN TETANGGA (RT)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rts`;
CREATE TABLE `rts` (
  `id` VARCHAR(50) NOT NULL,
  `rw_id` VARCHAR(50) NOT NULL,
  `number` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100),
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `leader` VARCHAR(100),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`rw_id`) REFERENCES `rws`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `rts` (`id`, `rw_id`, `number`, `name`, `status`, `leader`) VALUES
('rt-01-01', 'rw-01', '01', 'RT 01 Mawar', 'active', 'Bpk. Joko'),
('rt-01-02', 'rw-01', '02', 'RT 02 Melati', 'active', 'Bpk. Slamet'),
('rt-01-03', 'rw-01', '03', 'RT 03 Anggrek', 'active', 'Ibu Wati'),
('rt-02-01', 'rw-02', '01', 'RT 01 Kenanga', 'active', 'Bpk. Dedi'),
('rt-02-02', 'rw-02', '02', 'RT 02 Cempaka', 'active', 'Bpk. Agus'),
('rt-03-01', 'rw-03', '01', 'RT 01 Flamboyan', 'active', 'Ibu Sri'),
('rt-03-02', 'rw-03', '02', 'RT 02 Bougenville', 'active', 'Bpk. Rahmat'),
('rt-04-01', 'rw-04', '01', 'RT 01 Pinus', 'active', 'Bpk. Kardi'),
('rt-04-02', 'rw-04', '02', 'RT 02 Cemara', 'active', 'Ibu Endang'),
('rt-05-01', 'rw-05', '01', 'RT 01 Teratai', 'active', 'Bpk. Wahyu'),
('rt-05-02', 'rw-05', '02', 'RT 02 Dahlia', 'active', 'Bpk. Yudi');

-- --------------------------------------------------------
-- 6. TABEL SETORAN WARGA (DEPOSITS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `deposits`;
CREATE TABLE `deposits` (
  `id` VARCHAR(50) NOT NULL,
  `transaction_no` VARCHAR(50) NOT NULL,
  `program_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `day` VARCHAR(20) NOT NULL,
  `rw_id` VARCHAR(50) NOT NULL,
  `rt_id` VARCHAR(50) NOT NULL,
  `weight` DECIMAL(10, 2) NOT NULL,
  `notes` TEXT,
  `created_by` VARCHAR(100) DEFAULT 'Admin',
  `is_public` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`),
  FOREIGN KEY (`rw_id`) REFERENCES `rws`(`id`),
  FOREIGN KEY (`rt_id`) REFERENCES `rts`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `deposits` (`id`, `transaction_no`, `program_id`, `date`, `day`, `rw_id`, `rt_id`, `weight`, `notes`, `created_by`, `is_public`) VALUES
('dep-001', 'STR-2026-001', 'prog-bank-sampah', '2026-03-01', 'Minggu', 'rw-01', 'rt-01-01', 125.50, 'Kardus cokelat dan botol bening PET', 'Admin', 1),
('dep-002', 'STR-2026-002', 'prog-bank-sampah', '2026-03-01', 'Minggu', 'rw-01', 'rt-01-02', 88.00, 'Kertas arsip & kaleng bekas susu', 'Admin', 1),
('dep-003', 'STR-2026-003', 'prog-aren', '2026-03-02', 'Senin', 'rw-02', 'rt-02-01', 210.00, 'Nira aren segar panen pagi kader aren', 'Admin', 1),
('dep-004', 'STR-2026-004', 'prog-bank-sampah', '2026-03-03', 'Selasa', 'rw-03', 'rt-03-01', 145.00, 'Kardus gelombang toko warga & botol oli bekas', 'Admin', 1),
('dep-005', 'STR-2026-005', 'prog-minyak-jelantah', '2026-03-04', 'Rabu', 'rw-02', 'rt-02-02', 35.50, 'Sedekah minyak jelantah 7 jeriken kecil RT 02', 'Admin', 1),
('dep-006', 'STR-2026-006', 'prog-kompos-maggot', '2026-03-05', 'Kamis', 'rw-04', 'rt-04-01', 320.00, 'Sampah sisa sayuran pasar dan dedaunan warga', 'Admin', 1),
('dep-007', 'STR-2026-007', 'prog-bank-sampah', '2026-03-06', 'Jumat', 'rw-05', 'rt-05-01', 95.00, 'Plastik campur dan botol kaca kecap/sirup', 'Admin', 1),
('dep-008', 'STR-2026-008', 'prog-kayu', '2026-03-07', 'Sabtu', 'rw-04', 'rt-04-02', 450.00, 'Potongan kayu ranting sengon untuk bahan arang', 'Admin', 1);

-- --------------------------------------------------------
-- 7. TABEL PENJUALAN KOMODITAS (SALES)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `id` VARCHAR(50) NOT NULL,
  `transaction_no` VARCHAR(50) NOT NULL,
  `program_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `day` VARCHAR(20) NOT NULL,
  `item_type` VARCHAR(100) NOT NULL,
  `weight` DECIMAL(10, 2) NOT NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `total` DECIMAL(15, 2) NOT NULL,
  `buyer` VARCHAR(150),
  `notes` TEXT,
  `created_by` VARCHAR(100) DEFAULT 'Admin',
  `is_public` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `sales` (`id`, `transaction_no`, `program_id`, `date`, `day`, `item_type`, `weight`, `price`, `total`, `buyer`, `notes`, `created_by`, `is_public`) VALUES
('sal-001', 'PJL-2026-001', 'prog-bank-sampah', '2026-03-03', 'Selasa', 'Kardus Cokelat', 350.00, 2200.00, 770000.00, 'Pengepul Berkah Lestari (Bpk. Mamat)', 'Diangkut dengan pick-up posko pusat', 'Admin', 1),
('sal-002', 'PJL-2026-002', 'prog-bank-sampah', '2026-03-04', 'Rabu', 'Botol Plastik PET Bening', 180.00, 3800.00, 684000.00, 'CV Daur Mulia Sejahtera', 'Kondisi bersih tanpa tutup dan label', 'Admin', 1),
('sal-003', 'PJL-2026-003', 'prog-aren', '2026-03-05', 'Kamis', 'Gula Semut Aren Organik', 50.00, 32000.00, 1600000.00, 'Koperasi Agro Makmur', 'Kemasan pouch 500gr label KANG DIKIN', 'Admin', 1),
('sal-004', 'PJL-2026-004', 'prog-minyak-jelantah', '2026-03-07', 'Sabtu', 'Minyak Jelantah Tersaring', 40.00, 7500.00, 300000.00, 'PT Bio Energi Nusantara', 'Terkumpul dalam 2 jeriken besar', 'Admin', 1),
('sal-005', 'PJL-2026-005', 'prog-kompos-maggot', '2026-03-08', 'Minggu', 'Pupuk Kasgot Matang', 200.00, 2500.00, 500000.00, 'Kelompok Tani Subur Makmur RW 04', 'Pupuk organik hayati siap tabur pekarangan', 'Admin', 1);

-- --------------------------------------------------------
-- 8. TABEL PEMANFAATAN DANA BERSAMA (UTILIZATIONS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `utilizations`;
CREATE TABLE `utilizations` (
  `id` VARCHAR(50) NOT NULL,
  `transaction_no` VARCHAR(50) NOT NULL,
  `program_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `day` VARCHAR(20) NOT NULL,
  `rw_id` VARCHAR(50) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `recipient` VARCHAR(150),
  `created_by` VARCHAR(100) DEFAULT 'Admin',
  `is_public` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`),
  FOREIGN KEY (`rw_id`) REFERENCES `rws`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `utilizations` (`id`, `transaction_no`, `program_id`, `date`, `day`, `rw_id`, `type`, `amount`, `description`, `recipient`, `created_by`, `is_public`) VALUES
('utl-001', 'PMF-2026-001', 'prog-bank-sampah', '2026-03-04', 'Rabu', 'rw-01', 'Santunan Warga Sakit', 400000.00, 'Bantuan pengobatan rawat inap warga prasejahtera RT 02 Dusun Karang Asri', 'Keluarga Bpk. Sastro (RT 02)', 'Admin', 1),
('utl-002', 'PMF-2026-002', 'prog-bank-sampah', '2026-03-05', 'Kamis', 'rw-02', 'Pengadaan Sarana Kebersihan', 350000.00, 'Pengadaan 4 buah tong pilah komunal dan terpal posko timbang RW 02', 'Pengurus RT 01 & 02 Sukamaju', 'Admin', 1),
('utl-003', 'PMF-2026-003', 'prog-aren', '2026-03-06', 'Jumat', 'rw-02', 'Pemberdayaan Kader Tani', 500000.00, 'Bantuan wajan tembaga dan tungku hemat kayu untuk kelompok perajin gula aren', 'Kelompok Perajin Aren RW 02', 'Admin', 1),
('utl-004', 'PMF-2026-004', 'prog-kompos-maggot', '2026-03-08', 'Minggu', 'rw-04', 'Penghijauan & Bibit Tanaman', 450000.00, 'Pengadaan 50 polybag bibit cabai, tomat, dan pupuk kompos untuk kebun gizi RT 01', 'Kelompok Wanita Tani (KWT) RW 04', 'Admin', 1);

-- --------------------------------------------------------
-- 9. TABEL MASTER HARGA ACUAN KOMODITAS
-- --------------------------------------------------------
DROP TABLE IF EXISTS `item_types`;
CREATE TABLE `item_types` (
  `id` VARCHAR(50) NOT NULL,
  `program_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `unit` VARCHAR(20) DEFAULT 'Kg',
  `default_price` DECIMAL(15, 2) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `item_types` (`id`, `program_id`, `name`, `unit`, `default_price`) VALUES
('item-01', 'prog-bank-sampah', 'Kardus Cokelat', 'Kg', 2200.00),
('item-02', 'prog-bank-sampah', 'Botol Plastik PET Bening', 'Kg', 3800.00),
('item-03', 'prog-bank-sampah', 'Gelas Plastik Cup PP', 'Kg', 2800.00),
('item-04', 'prog-bank-sampah', 'Besi & Logam Tua', 'Kg', 4200.00),
('item-05', 'prog-bank-sampah', 'Kertas Arsip / HVS', 'Kg', 1800.00),
('item-06', 'prog-aren', 'Gula Semut Aren', 'Kg', 32000.00),
('item-07', 'prog-aren', 'Gula Gandu Tradisional', 'Kg', 25000.00),
('item-08', 'prog-minyak-jelantah', 'Minyak Jelantah Bersih', 'Kg', 7500.00),
('item-09', 'prog-kompos-maggot', 'Pupuk Kasgot Siap Tabur', 'Kg', 2500.00),
('item-10', 'prog-kompos-maggot', 'Fresh Maggot BSF', 'Kg', 7000.00);

-- --------------------------------------------------------
-- VIEW UNTUK MEMUDAHKAN LAPORAN KAS BERSAMA & REKAP RW
-- --------------------------------------------------------
CREATE OR REPLACE VIEW `v_rekap_rw` AS
SELECT 
  r.id AS rw_id,
  r.number AS rw_number,
  r.name AS rw_name,
  r.leader AS rw_leader,
  COALESCE(SUM(d.weight), 0) AS total_weight_kg,
  COUNT(DISTINCT d.id) AS total_deposits_count,
  COALESCE((SELECT SUM(u.amount) FROM utilizations u WHERE u.rw_id = r.id), 0) AS total_utilization_rp
FROM rws r
LEFT JOIN deposits d ON d.rw_id = r.id
GROUP BY r.id, r.number, r.name, r.leader;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- SELESAI. Database 'kang_dikin' siap digunakan dengan XAMPP & phpMyAdmin!
-- ====================================================================
