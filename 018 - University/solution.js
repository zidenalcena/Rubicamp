const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const Table = require('cli-table');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let db = new sqlite3.Database('university.db', err => {
  if (err) {
    return console.error(err.message);
  }
});

let username;

class University {
  homepage() {
    console.log(`====================================================
Welcome to Universitas Pendidikan Indonesia  
Jl Setiabudhi No. 255
====================================================`);
    const login = new Login();
    login.login();
  }
}

class Login extends University {
  login() {
    rl.question('username: ', answer => {
      const sql = `SELECT username FROM users WHERE username = ?`;
      username = answer;

      db.all(sql, [username], (err, name) => {
        if (err) throw err;

        console.log('====================================================');
        rl.question('password: ', answer => {
          const pw = answer;
          const sql = `SELECT password FROM users WHERE username = ?`;

          db.all(sql, [username], (err, pass) => {
            if (err) throw err;

            if (pass.length > 0 && pw === pass[0].password) {
              const welcome = new Welcome();
              welcome.welcome();
            } else {
              console.log('username atau password salah.');

              const login = new University();
              login.homepage();
            }
          });
        });
      });
    });
  }
}

class Welcome extends University {
  welcome() {
    console.log('====================================================');
    const sql = `SELECT username, level FROM users WHERE username = ?`;

    db.all(sql, [username], (err, rows) => {
      if (err) throw err;

      if (rows.length > 0) {
        console.log(
          `Welcome, ${rows[0].username}. Your access level is: ${rows[0].level}`
        );

        const dashboard = new Dashboard();
        dashboard.question();
      }
    });
  }
}

class Dashboard {
  question() {
    const firstQuestion = `====================================================
silakan pilih opsi di bawah ini
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar
====================================================`;

    console.log(firstQuestion);
    return this.answer();
  }

  answer() {
    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          const mahasiswa = new Mahasiswa();
          mahasiswa.mahasiswaField();
          break;

        case '2':
          const jurusan = new Jurusan();
          jurusan.jurusanField();
          break;

        case '3':
          const dosen = new Dosen();
          dosen.dosenField();
          break;

        case '4':
          const matakuliah = new MataKuliah();
          matakuliah.matakuliahField();
          break;

        case '5':
          const kontrak = new Kontrak();
          kontrak.kontrakField();
          break;

        case '6':
          const keluar = new Out();
          keluar.keluar();
          break;

        default:
          this.question();
          break;
      }
    });
  }
}

class Mahasiswa {
  mahasiswaField() {
    const muridQuestion = `====================================================
silakan pilih opsi di bawah ini
[1] Daftar Murid
[2] Cari Murid
[3] Tambah Murid
[4] Hapus Murid
[5] Kembali
====================================================`;

    console.log(muridQuestion);

    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          this.daftarMurid();
          break;

        case '2':
          this.cariMurid();
          break;

        case '3':
          this.tambahMurid();
          break;

        case '4':
          this.hapusMurid();
          break;

        case '5':
          const back = new Back();
          back.kembali();
          break;

        default:
          this.mahasiswaField();
          break;
      }
    });
  }

  daftarMurid() {
    const sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas`;

    return db.all(sql, [], (err, rows) => {
      if (err) throw err;

      const table = new Table({
        head: ['NIM', 'Nama', 'Alamat', 'Jurusan'],
        colWidths: [10, 25, 15, 10]
      });

      rows.forEach(row => {
        table.push([row.nim, row.nama, row.alamat, row.jurusan]);
      });

      console.log('====================================================');
      console.log(table.toString());
      this.mahasiswaField();
    });
  }

  cariMurid() {
    console.log('====================================================');
    return rl.question('Masukkan NIM: ', answer => {
      const sql = `SELECT nim, nama, alamat, jurusan FROM mahasiswas WHERE mahasiswas.nim = ?`;
      const nim = answer;

      db.all(sql, [nim], (err, row) => {
        if (err) throw err;

        if (row.length > 0) {
          console.log('====================================================');
          console.log('student details');
          console.log('====================================================');
          console.log(`id       : ${row[0].nim}`);
          console.log(`nama     : ${row[0].nama}`);
          console.log(`alamat   : ${row[0].alamat}`);
          console.log(`jurusan  : ${row[0].jurusan}`);
          console.log('====================================================');
        } else {
          console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
          console.log('====================================================');
        }
        this.mahasiswaField();
      });
    });
  }

  tambahMurid() {
    console.log('====================================================');
    console.log('lengkapi data di bawah ini:');
    const dataMurid = [];
    return rl.question('NIM: ', nim => {
      dataMurid[0] = nim;
      rl.question('nama: ', nama => {
        dataMurid[1] = nama;
        rl.question('alamat: ', alamat => {
          dataMurid[2] = alamat;
          rl.question('jurusan: ', jurusan => {
            dataMurid[3] = jurusan;
            rl.question('umur: ', umur => {
              dataMurid[4] = Number(umur);
              const sql = `INSERT INTO mahasiswas(nim, nama, alamat, jurusan, umur) VALUES(?, ?, ?, ?, ?)`;

              db.run(sql, dataMurid, err => {
                if (err) throw err;

                this.daftarMurid();
              });
            });
          });
        });
      });
    });
  }

  hapusMurid() {
    console.log('====================================================');
    return rl.question('masukkan NIM mahasiswa yang akan dihapus: ', answer => {
      const nim = answer;
      const sql = `DELETE FROM mahasiswas WHERE nim = ?`;

      db.run(sql, nim, err => {
        if (err) throw err;

        this.daftarMurid();
      });
    });
  }
}

class Jurusan {
  jurusanField() {
    const jurusanQuestion = `====================================================
[1] Daftar Jurusan
[2] Cari Jurusan
[3] Tambah Jurusan
[4] Hapus Jurusan
[5] Kembali
====================================================`;

    console.log(jurusanQuestion);

    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          this.daftarJurusan();
          break;

        case '2':
          this.cariJurusan();
          break;

        case '3':
          this.tambahJurusan();
          break;

        case '4':
          this.hapusJurusan();
          break;

        case '5':
          const back = new Back();
          back.kembali();
          break;

        default:
          this.jurusanField();
          break;
      }
    });
  }

  daftarJurusan() {
    const sql = `SELECT jurusanId, namajurusan FROM jurusans`;

    return db.all(sql, [], (err, rows) => {
      if (err) throw err;

      const table = new Table({
        head: ['ID', 'Nama Jurusan'],
        colWidths: [10, 25]
      });

      rows.forEach(row => {
        table.push([row.jurusanId, row.namajurusan]);
      });

      console.log('====================================================');
      console.log(table.toString());
      this.jurusanField();
    });
  }

  cariJurusan() {
    console.log('====================================================');
    return rl.question('Masukkan ID Jurusan: ', answer => {
      const sql = `SELECT jurusanId, namajurusan FROM jurusans WHERE jurusans.jurusanId = ?`;
      const idJur = answer;

      db.all(sql, [idJur], (err, row) => {
        if (err) throw err;

        if (row.length > 0) {
          console.log('====================================================');
          console.log('jurusan details');
          console.log('====================================================');
          console.log(`id       : ${row[0].jurusanId}`);
          console.log(`jurusan  : ${row[0].namajurusan}`);
          console.log('====================================================');
        } else {
          console.log(`jurusan dengan id ${idJur} tidak terdaftar`);
          console.log('====================================================');
        }
        this.jurusanField();
      });
    });
  }

  tambahJurusan() {
    console.log('====================================================');
    console.log('lengkapi data di bawah ini:');
    const dataJurusan = [];
    return rl.question('ID: ', jurusanId => {
      dataJurusan[0] = jurusanId;
      rl.question('jurusan: ', namajurusan => {
        dataJurusan[1] = namajurusan;
        const sql = `INSERT INTO jurusans(jurusanId, namajurusan) VALUES(?, ?)`;

        db.run(sql, dataJurusan, err => {
          if (err) throw err;

          this.daftarJurusan();
        });
      });
    });
  }

  hapusJurusan() {
    console.log('====================================================');
    return rl.question('masukkan ID jurusan yang akan dihapus: ', answer => {
      const jurusanId = answer;
      const sql = `DELETE FROM jurusans WHERE jurusanId = ?`;

      db.run(sql, jurusanId, err => {
        if (err) throw err;

        this.daftarJurusan();
      });
    });
  }
}

class Dosen {
  dosenField() {
    const dosenQuestion = `====================================================
[1] Daftar Dosen
[2] Cari Dosen
[3] Tambah Dosen
[4] Hapus Dosen
[5] Kembali
====================================================`;

    console.log(dosenQuestion);

    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          this.daftarDosen();
          break;

        case '2':
          this.cariDosen();
          break;

        case '3':
          this.tambahDosen();
          break;

        case '4':
          this.hapusDosen();
          break;

        case '5':
          const back = new Back();
          back.kembali();
          break;

        default:
          this.dosenField();
          break;
      }
    });
  }

  daftarDosen() {
    const sql = `SELECT nip, namadosen FROM dosens`;

    return db.all(sql, [], (err, rows) => {
      if (err) throw err;

      const table = new Table({
        head: ['ID', 'Nama'],
        colWidths: [10, 25]
      });

      rows.forEach(row => {
        table.push([row.nip, row.namadosen]);
      });

      console.log('====================================================');
      console.log(table.toString());
      this.dosenField();
    });
  }

  cariDosen() {
    console.log('====================================================');
    return rl.question('Masukkan NIM: ', answer => {
      const sql = `SELECT nip, namadosen FROM dosens WHERE dosens.nip = ?`;
      const nip = answer;

      db.all(sql, [nip], (err, row) => {
        if (err) throw err;

        if (row.length > 0) {
          console.log('====================================================');
          console.log('dosen details');
          console.log('====================================================');
          console.log(`nip      : ${row[0].nip}`);
          console.log(`nama     : ${row[0].namadosen}`);
          console.log('====================================================');
        } else {
          console.log(`dosen dengan nip ${nip} tidak terdaftar`);
          console.log('====================================================');
        }
        this.dosenField();
      });
    });
  }

  tambahDosen() {
    console.log('====================================================');
    console.log('lengkapi data di bawah ini:');
    const dataDosen = [];
    return rl.question('NIP: ', nip => {
      dataDosen[0] = nip;
      rl.question('nama dosen: ', namadosen => {
        dataDosen[1] = namadosen;
        const sql = `INSERT INTO dosens(nip, namadosen) VALUES(?, ?)`;

        db.run(sql, dataDosen, err => {
          if (err) throw err;

          this.daftarDosen();
        });
      });
    });
  }

  hapusDosen() {
    console.log('====================================================');
    return rl.question('masukkan NIP dosen yang akan dihapus: ', answer => {
      const nip = answer;
      const sql = `DELETE FROM dosens WHERE nip = ?`;

      db.run(sql, nip, err => {
        if (err) throw err;

        this.daftarDosen();
      });
    });
  }
}

class MataKuliah {
  matakuliahField() {
    const matakuliahQuestion = `====================================================
[1] Daftar Mata Kuliah
[2] Cari Mata Kuliah
[3] Tambah Mata Kuliah
[4] Hapus Mata Kuliah
[5] Kembali
====================================================`;

    console.log(matakuliahQuestion);

    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          this.daftarMataKuliah();
          break;

        case '2':
          this.cariMataKuliah();
          break;

        case '3':
          this.tambahMataKuliah();
          break;

        case '4':
          this.hapusMataKuliah();
          break;

        case '5':
          const back = new Back();
          back.kembali();
          break;

        default:
          this.matakuliahField();
          break;
      }
    });
  }

  daftarMataKuliah() {
    const sql = `SELECT mkId, namamk, sks FROM matakuliahs`;

    return db.all(sql, [], (err, rows) => {
      if (err) throw err;

      const table = new Table({
        head: ['ID', 'Mata Kuliah', 'SKS'],
        colWidths: [10, 25, 10]
      });

      rows.forEach(row => {
        table.push([row.mkId, row.namamk, row.sks]);
      });

      console.log('====================================================');
      console.log(table.toString());
      this.matakuliahField();
    });
  }

  cariMataKuliah() {
    console.log('====================================================');
    return rl.question('Masukkan ID: ', answer => {
      const sql = `SELECT mkId, namamk, sks FROM matakuliahs WHERE matakuliahs.mkId = ?`;
      const mkId = answer;

      db.all(sql, [mkId], (err, row) => {
        if (err) throw err;

        if (row.length > 0) {
          console.log('====================================================');
          console.log('mata kuliah details');
          console.log('====================================================');
          console.log(`id       : ${row[0].mkId}`);
          console.log(`nama     : ${row[0].namamk}`);
          console.log(`alamat   : ${row[0].sks}`);
          console.log('====================================================');
        } else {
          console.log(`mata kuliah dengan id ${mkId} tidak terdaftar`);
          console.log('====================================================');
        }
        this.matakuliahField();
      });
    });
  }

  tambahMataKuliah() {
    console.log('====================================================');
    console.log('lengkapi data di bawah ini:');
    const dataMataKuliah = [];
    return rl.question('ID: ', mkId => {
      dataMataKuliah[0] = mkId;
      rl.question('mata kuliah: ', namamk => {
        dataMataKuliah[1] = namamk;
        rl.question('sks: ', sks => {
          dataMataKuliah[2] = sks;
          const sql = `INSERT INTO matakuliahs(mkId, namamk, sks ) VALUES(?, ?, ?)`;

          db.run(sql, dataMataKuliah, err => {
            if (err) throw err;

            this.daftarMataKuliah();
          });
        });
      });
    });
  }

  hapusMataKuliah() {
    console.log('====================================================');
    return rl.question(
      'masukkan ID mata kuliah yang akan dihapus: ',
      answer => {
        const mkId = answer;
        const sql = `DELETE FROM matakuliahs WHERE mkId = ?`;

        db.run(sql, mkId, err => {
          if (err) throw err;

          this.daftarMataKuliah();
        });
      }
    );
  }
}

class Kontrak {
  kontrakField() {
    const kontrakQuestion = `====================================================
[1] Daftar Kontrak
[2] Cari Kontrak
[3] Tambah Kontrak
[4] Hapus Kontrak
[5] Kembali
====================================================`;

    console.log(kontrakQuestion);

    return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
      switch (answer) {
        case '1':
          this.daftarKontrak();
          break;

        case '2':
          this.cariKontrak();
          break;

        case '3':
          this.tambahKontrak();
          break;

        case '4':
          this.hapusKontrak();
          break;

        case '5':
          const back = new Back();
          back.kembali();
          break;

        default:
          this.kontrakField();
          break;
      }
    });
  }

  daftarKontrak() {
    const sql = `SELECT id, nim, dosen, matakuliah, nilai FROM reports`;

    return db.all(sql, [], (err, rows) => {
      if (err) throw err;

      const table = new Table({
        head: ['id', 'nim', 'dosen', 'matakuliah', 'nilai'],
        colWidths: [10, 10, 10, 10, 10]
      });

      rows.forEach(row => {
        table.push([row.id, row.nim, row.dosen, row.matakuliah, row.nilai]);
      });

      console.log('====================================================');
      console.log(table.toString());
      this.kontrakField();
    });
  }

  cariKontrak() {
    console.log('====================================================');
    return rl.question('Masukkan ID: ', answer => {
      const sql = `SELECT id, nim, dosen, matakuliah, nilai FROM reports WHERE reports.id = ?`;
      const id = answer;

      db.all(sql, [id], (err, row) => {
        if (err) throw err;

        if (row.length > 0) {
          console.log('====================================================');
          console.log('kontrak details');
          console.log('====================================================');
          console.log(`id         : ${row[0].id}`);
          console.log(`nim        : ${row[0].nim}`);
          console.log(`dosen      : ${row[0].dosen}`);
          console.log(`matakuliah : ${row[0].matakuliah}`);
          console.log(`nilai      : ${row[0].nilai}`);
          console.log('====================================================');
        } else {
          console.log(`kontrak dengan id ${id} tidak terdaftar`);
          console.log('====================================================');
        }
        this.kontrakField();
      });
    });
  }

  tambahKontrak() {
    console.log('====================================================');
    console.log('lengkapi data di bawah ini:');
    const dataKontrak = [];
    return rl.question('ID: ', id => {
      dataKontrak[0] = id;
      rl.question('nim: ', nim => {
        dataKontrak[1] = nim;
        rl.question('dosen: ', dosen => {
          dataKontrak[2] = dosen;
          rl.question('matakuliah: ', matakuliah => {
            dataKontrak[3] = matakuliah;
            rl.question('nilai: ', nilai => {
              dataKontrak[4] = nilai;
              const sql = `INSERT INTO reports(id, nim, dosen, matakuliah, nilai) VALUES(?, ?, ?, ?, ?)`;

              db.run(sql, dataKontrak, err => {
                if (err) throw err;

                this.daftarKontrak();
              });
            });
          });
        });
      });
    });
  }

  hapusKontrak() {
    console.log('====================================================');
    return rl.question('masukkan ID kontrak yang akan dihapus: ', answer => {
      const id = answer;
      const sql = `DELETE FROM reports WHERE id = ?`;

      db.run(sql, id, err => {
        if (err) throw err;

        this.daftarKontrak();
      });
    });
  }
}

class Back {
  kembali() {
    const dashboard = new Dashboard();
    dashboard.question();
  }
}

class Out {
  keluar() {
    console.log('====================================================');
    console.log('Kamu telah keluar.');

    const login = new University();
    login.homepage();
  }
}

const start = new University();
start.homepage();
