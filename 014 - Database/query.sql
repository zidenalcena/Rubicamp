-- Create a new database
sqlite3 university.db

-- Create table mahasiswas
CREATE TABLE mahasiswas (
  nim TEXT PRIMARY KEY, 
  nama TEXT NOT NULL, 
  alamat TEXT NOT NULL, 
  umur INTEGER NOT NULL,
  jurusan TEXT NOT NULL, 
      FOREIGN KEY (jurusan) REFERENCES jurusans(id)
);

-- Insert values to mahasiswas
INSERT INTO mahasiswas ( 
  nim, 
  nama, 
  alamat, 
  umur,
  jurusan 
) VALUES ( 
  "0001", 
  "Ikhda Muhammad Wildani", 
  "Jepara", 
  20,
  1
);

INSERT INTO mahasiswas ( 
  nim, 
  nama, 
  alamat, 
  umur,
  jurusan 
) VALUES ( 
  "0010", 
  "John Doe", 
  "Los Angeles", 
  23,
  2 
);

INSERT INTO mahasiswas ( 
  nim, 
  nama, 
  alamat, 
  umur,
  jurusan 
) VALUES ( 
  "0011", 
  "Kim So-hyun", 
  "Busan", 
  20,
  3 
);

INSERT INTO mahasiswas ( 
  nim, 
  nama, 
  alamat, 
  umur,
  jurusan 
) VALUES ( 
  "0100", 
  "Nanako Tojo", 
  "Kyoto", 
  18,
  2 
);

INSERT INTO mahasiswas ( 
  nim, 
  nama, 
  alamat, 
  umur,
  jurusan 
) VALUES ( 
  "0101", 
  "Amari Kyoko", 
  "Tokyo", 
  19,
  3 
);

-- Create table jurusans
CREATE TABLE jurusans (
  jurusanId INTEGER PRIMARY KEY, 
  namajurusan TEXT NOT NULL 
);

-- Insert value to jurusans
INSERT INTO jurusans ( namajurusan ) VALUES ( "Bahasa Jepang" );
INSERT INTO jurusans ( namajurusan ) VALUES ( "Bahasa Korea" );
INSERT INTO jurusans ( namajurusan ) VALUES ( "Bahasa Indonesia" );

-- Create table dosens
CREATE TABLE dosens ( nip TEXT PRIMARY KEY, namadosen TEXT NOT NULL );

-- Insert value to dosens
INSERT INTO dosens ( nip, namadosen ) VALUES ( "TI1", "Aika Sonoda" );
INSERT INTO dosens ( nip, namadosen ) VALUES ( "TI2", "Park Ji Soo" );
INSERT INTO dosens ( nip, namadosen ) VALUES ( "TI3", "Genta Perdana" );

-- Create table matakuliahs
CREATE TABLE matakuliahs ( 
  mkId INTEGER PRIMARY KEY, 
  namamk TEXT NOT NULL, 
  sks INTEGER NOT NULL
);

-- Insert value to matakuliahs
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Hiragana",  4);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Katakana",  4);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Kanji",  4);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Hangeul",  4);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Tata Bahasa",  3);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Peribahasa",  2);
INSERT INTO matakuliahs ( namamk, sks ) VALUES ( "Data Mining",  2);

-- Create table reports
CREATE TABLE reports (
  id INTEGER PRIMARY KEY, 
  nim TEXT NOT NULL, 
  dosen TEXT NOT NULL, 
  matakuliah INTEGER NOT NULL, 
  nilai TEXT NOT NULL, 
      FOREIGN KEY (nim) REFERENCES mahasiswas(nim),
      FOREIGN KEY (dosen) REFERENCES dosens(nip)
      FOREIGN KEY (matakuliah) REFERENCES matakuliahs(mkId)
);

-- Insert values to reports
INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0001", 
  "TI1", 
  1, 
  "A"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0001", 
  "TI1", 
  2, 
  "A"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0001", 
  "TI1", 
  3, 
  "B"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0010", 
  "TI2", 
  4, 
  "D"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0010", 
  "TI2", 
  7, 
  "B"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0011", 
  "TI3", 
  5, 
  "B"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0011", 
  "TI3", 
  6, 
  "B"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0100", 
  "TI2", 
  4, 
  "C"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0101", 
  "TI3", 
  5, 
  "C"
);

INSERT INTO reports ( 
  nim, 
  dosen, 
  matakuliah, 
  nilai 
) VALUES ( 
  "0101", 
  "TI3", 
  6, 
  "D"
);

-- How to see value in the tables
SELECT * FROM mahasiswas;
SELECT * FROM dosens;
SELECT * FROM jurusans;
SELECT * FROM matakuliahs;
SELECT * FROM reports;

-- How to delete table
DROP TABLE mahasiswas;
DROP TABLE dosens;
DROP TABLE jurusans;
DROP TABLE matakuliahs;
DROP TABLE reports;
