import { RW, RT, Program, Deposit, Sale, Utilization, ItemTypeMaster, ProgramCategory } from '../types';

interface LiveDataPayload {
  programs: Program[];
  rws: RW[];
  rts: RT[];
  deposits: Deposit[];
  sales: Sale[];
  utilizations: Utilization[];
  categories?: ProgramCategory[];
  itemTypes?: ItemTypeMaster[];
}

export function generateLiveSqlDump(data: LiveDataPayload): string {
  const escapeStr = (val: any) => {
    if (val === null || val === undefined) return 'NULL';
    const str = String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        default:
          return char;
      }
    });
    return `'${str}'`;
  };

  const sqlHeader = `-- ====================================================================
-- CADANGAN DATABASE KANG DIKIN TERBARU
-- Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}
-- Kompatibel dengan: MySQL 5.7+, MySQL 8.0, MariaDB 10+ (XAMPP phpMyAdmin)
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`kang_dikin\`;
CREATE DATABASE \`kang_dikin\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`kang_dikin\`;

-- --------------------------------------------------------
-- 1. TABEL PENGGUNA (USERS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'staff', 'public') DEFAULT 'admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`) VALUES
('usr-admin-01', 'Administrator KANG DIKIN', 'admin@kangdikin.desa.id', 'admin123', 'admin'),
('usr-staff-01', 'Kader Lingkungan Desa', 'kader@kangdikin.desa.id', 'kader123', 'staff');

-- --------------------------------------------------------
-- 2. TABEL PROGRAM
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`programs\`;
CREATE TABLE \`programs\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(150) NOT NULL UNIQUE,
  \`description\` TEXT,
  \`icon\` VARCHAR(50) DEFAULT 'Recycle',
  \`image\` TEXT,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`is_public\` TINYINT(1) DEFAULT 1,
  \`category\` VARCHAR(100),
  \`color\` VARCHAR(50) DEFAULT 'emerald',
  \`created_at\` DATE,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let programsInserts = '';
  if (data.programs.length > 0) {
    const rows = data.programs.map((p) => {
      return `(${escapeStr(p.id)}, ${escapeStr(p.name)}, ${escapeStr(p.slug)}, ${escapeStr(p.description)}, ${escapeStr(p.icon)}, ${escapeStr(p.image || '')}, ${p.is_active ? 1 : 0}, ${p.is_public ? 1 : 0}, ${escapeStr(p.category)}, ${escapeStr(p.color)}, ${escapeStr(p.createdAt)})`;
    });
    programsInserts = `INSERT INTO \`programs\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`icon\`, \`image\`, \`is_active\`, \`is_public\`, \`category\`, \`color\`, \`created_at\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const rwsTable = `
-- --------------------------------------------------------
-- 3. TABEL RUKUN WARGA (RW)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`rws\`;
CREATE TABLE \`rws\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`number\` VARCHAR(10) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`status\` ENUM('active', 'inactive') DEFAULT 'active',
  \`leader\` VARCHAR(100),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let rwsInserts = '';
  if (data.rws.length > 0) {
    const rows = data.rws.map((r) => {
      return `(${escapeStr(r.id)}, ${escapeStr(r.number)}, ${escapeStr(r.name)}, ${escapeStr(r.status)}, ${escapeStr(r.leader || '')})`;
    });
    rwsInserts = `INSERT INTO \`rws\` (\`id\`, \`number\`, \`name\`, \`status\`, \`leader\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const rtsTable = `
-- --------------------------------------------------------
-- 4. TABEL RUKUN TETANGGA (RT)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`rts\`;
CREATE TABLE \`rts\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`rw_id\` VARCHAR(50) NOT NULL,
  \`number\` VARCHAR(10) NOT NULL,
  \`name\` VARCHAR(100),
  \`status\` ENUM('active', 'inactive') DEFAULT 'active',
  \`leader\` VARCHAR(100),
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`rw_id\`) REFERENCES \`rws\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let rtsInserts = '';
  if (data.rts.length > 0) {
    const rows = data.rts.map((rt) => {
      return `(${escapeStr(rt.id)}, ${escapeStr(rt.rw_id)}, ${escapeStr(rt.number)}, ${escapeStr(rt.name || '')}, ${escapeStr(rt.status)}, ${escapeStr(rt.leader || '')})`;
    });
    rtsInserts = `INSERT INTO \`rts\` (\`id\`, \`rw_id\`, \`number\`, \`name\`, \`status\`, \`leader\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const depositsTable = `
-- --------------------------------------------------------
-- 5. TABEL BUKU SETORAN WARGA (DEPOSITS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`deposits\`;
CREATE TABLE \`deposits\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`transaction_no\` VARCHAR(50) NOT NULL,
  \`program_id\` VARCHAR(50) NOT NULL,
  \`date\` DATE NOT NULL,
  \`day\` VARCHAR(20) NOT NULL,
  \`rw_id\` VARCHAR(50) NOT NULL,
  \`rt_id\` VARCHAR(50) NOT NULL,
  \`weight\` DECIMAL(10, 2) NOT NULL,
  \`notes\` TEXT,
  \`created_by\` VARCHAR(100) DEFAULT 'Admin',
  \`is_public\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`),
  FOREIGN KEY (\`rw_id\`) REFERENCES \`rws\`(\`id\`),
  FOREIGN KEY (\`rt_id\`) REFERENCES \`rts\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let depositsInserts = '';
  if (data.deposits.length > 0) {
    const rows = data.deposits.map((d) => {
      return `(${escapeStr(d.id)}, ${escapeStr(d.transaction_no)}, ${escapeStr(d.program_id)}, ${escapeStr(d.date)}, ${escapeStr(d.day)}, ${escapeStr(d.rw_id)}, ${escapeStr(d.rt_id)}, ${Number(d.weight) || 0}, ${escapeStr(d.notes || '')}, ${escapeStr(d.created_by || 'Admin')}, ${d.is_public ? 1 : 0})`;
    });
    depositsInserts = `INSERT INTO \`deposits\` (\`id\`, \`transaction_no\`, \`program_id\`, \`date\`, \`day\`, \`rw_id\`, \`rt_id\`, \`weight\`, \`notes\`, \`created_by\`, \`is_public\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const salesTable = `
-- --------------------------------------------------------
-- 6. TABEL HASIL PENJUALAN KOMODITAS (SALES)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`sales\`;
CREATE TABLE \`sales\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`transaction_no\` VARCHAR(50) NOT NULL,
  \`program_id\` VARCHAR(50) NOT NULL,
  \`date\` DATE NOT NULL,
  \`day\` VARCHAR(20) NOT NULL,
  \`item_type\` VARCHAR(100) NOT NULL,
  \`weight\` DECIMAL(10, 2) NOT NULL,
  \`price\` DECIMAL(15, 2) NOT NULL,
  \`total\` DECIMAL(15, 2) NOT NULL,
  \`buyer\` VARCHAR(150),
  \`notes\` TEXT,
  \`created_by\` VARCHAR(100) DEFAULT 'Admin',
  \`is_public\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let salesInserts = '';
  if (data.sales.length > 0) {
    const rows = data.sales.map((s) => {
      return `(${escapeStr(s.id)}, ${escapeStr(s.transaction_no)}, ${escapeStr(s.program_id)}, ${escapeStr(s.date)}, ${escapeStr(s.day)}, ${escapeStr(s.item_type)}, ${Number(s.weight) || 0}, ${Number(s.price) || 0}, ${Number(s.total) || 0}, ${escapeStr(s.buyer || '')}, ${escapeStr(s.notes || '')}, ${escapeStr(s.created_by || 'Admin')}, ${s.is_public ? 1 : 0})`;
    });
    salesInserts = `INSERT INTO \`sales\` (\`id\`, \`transaction_no\`, \`program_id\`, \`date\`, \`day\`, \`item_type\`, \`weight\`, \`price\`, \`total\`, \`buyer\`, \`notes\`, \`created_by\`, \`is_public\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const utilizationsTable = `
-- --------------------------------------------------------
-- 7. TABEL PENYALURAN DANA BERSAMA (UTILIZATIONS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`utilizations\`;
CREATE TABLE \`utilizations\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`transaction_no\` VARCHAR(50) NOT NULL,
  \`program_id\` VARCHAR(50) NOT NULL,
  \`date\` DATE NOT NULL,
  \`day\` VARCHAR(20) NOT NULL,
  \`rw_id\` VARCHAR(50) NOT NULL,
  \`type\` VARCHAR(100) NOT NULL,
  \`amount\` DECIMAL(15, 2) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`recipient\` VARCHAR(150),
  \`created_by\` VARCHAR(100) DEFAULT 'Admin',
  \`is_public\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`),
  FOREIGN KEY (\`rw_id\`) REFERENCES \`rws\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

  let utilizationsInserts = '';
  if (data.utilizations.length > 0) {
    const rows = data.utilizations.map((u) => {
      return `(${escapeStr(u.id)}, ${escapeStr(u.transaction_no)}, ${escapeStr(u.program_id)}, ${escapeStr(u.date)}, ${escapeStr(u.day)}, ${escapeStr(u.rw_id)}, ${escapeStr(u.type)}, ${Number(u.amount) || 0}, ${escapeStr(u.description)}, ${escapeStr(u.recipient || '')}, ${escapeStr(u.created_by || 'Admin')}, ${u.is_public ? 1 : 0})`;
    });
    utilizationsInserts = `INSERT INTO \`utilizations\` (\`id\`, \`transaction_no\`, \`program_id\`, \`date\`, \`day\`, \`rw_id\`, \`type\`, \`amount\`, \`description\`, \`recipient\`, \`created_by\`, \`is_public\`) VALUES\n${rows.join(',\n')};\n`;
  }

  const sqlFooter = `
-- --------------------------------------------------------
-- 8. VIEW REKAPITULASI CAPAIAN PER RW
-- --------------------------------------------------------
CREATE OR REPLACE VIEW \`v_rekap_rw\` AS
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
-- SELESAI EKSPOR DATA KANG DIKIN
`;

  return [
    sqlHeader,
    programsInserts,
    rwsTable,
    rwsInserts,
    rtsTable,
    rtsInserts,
    depositsTable,
    depositsInserts,
    salesTable,
    salesInserts,
    utilizationsTable,
    utilizationsInserts,
    sqlFooter,
  ].join('\n');
}

export function downloadSqlFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
