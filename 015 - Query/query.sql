-- 1
SELECT 
  nim, 
  nama, 
  alamat, 
  umur, 
  jurusan, 
  namajurusan 
FROM 
  mahasiswas, 
  jurusans 
WHERE 
mahasiswas.jurusan = jurusans.jurusanId;

-- 2
SELECT * FROM mahasiswas WHERE umur < 20;

-- 3
SELECT 
  nama, 
  nilai 
FROM 
  mahasiswas, 
  reports 
WHERE 
  mahasiswas.nim = reports.nim 
AND 
  reports.nilai <= "B";

-- 4
SELECT 
  mahasiswas.nama, 
  SUM(matakuliahs.sks) 
FROM 
  mahasiswas, 
  reports, 
  matakuliahs 
WHERE 
  mahasiswas.nim = reports.nim 
AND 
  reports.matakuliah = matakuliahs.mkId 
GROUP BY 
  mahasiswas.nama 
HAVING 
  SUM(matakuliahs.sks) > 10;

-- 5
SELECT 
  mahasiswas.nama, 
  matakuliahs.namamk 
FROM 
  mahasiswas, 
  reports, 
  matakuliahs 
WHERE 
  mahasiswas.nim = reports.nim 
AND 
  reports.matakuliah = matakuliahs.mkId 
AND 
  matakuliahs.namamk = "Data Mining";

-- 6
SELECT
  dosens.namadosen, 
  count(mahasiswas.nama)
FROM 
  dosens 
INNER JOIN
  reports
ON
  dosens.nip = reports.dosen 
INNER JOIN
  mahasiswas
ON
  reports.nim = mahasiswas.nim 
GROUP BY 
  namadosen;

-- 7
SELECT 
  nama, 
  umur 
FROM 
  mahasiswas 
ORDER BY 
  umur 
ASC;

-- 8

-- where
SELECT 
  mahasiswas.nama, 
  jurusans.namajurusan, 
  matakuliahs.namamk,
  reports.nilai, 
  dosens.namadosen
FROM 
  mahasiswas, 
  reports ,
  matakuliahs,
  jurusans,
  dosens
WHERE 
  mahasiswas.jurusan = jurusans.jurusanId
AND
  mahasiswas.nim = reports.nim 
AND
  reports.dosen = dosens.nip
AND
  reports.matakuliah = matakuliahs.mkId
AND 
  reports.nilai > "C";

-- inner join
SELECT 
  mahasiswas.nama, 
  jurusans.namajurusan, 
  matakuliahs.namamk,
  reports.nilai, 
  dosens.namadosen
FROM 
  mahasiswas
INNER JOIN
  jurusans
ON
  mahasiswas.jurusan = jurusans.jurusanId
INNER JOIN
  reports
ON
  mahasiswas.nim = reports.nim 
INNER JOIN
  dosens
ON
  reports.dosen = dosens.nip
INNER JOIN
  matakuliahs
ON
  reports.matakuliah = matakuliahs.mkId
AND 
  reports.nilai > "C";
