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

const login = () => {
  console.log('====================================================');
  console.log('Welcome to Universitas Pendidikan Indonesia');
  console.log('Jl Setiabudhi No. 255');
  console.log('====================================================');
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
            welcome();
          } else {
            console.log('username atau password salah.');
            login();
          }
        });
      });
    });
  });
};

const welcome = () => {
  console.log('====================================================');
  const sql = `SELECT username, level FROM users WHERE username = ?`;

  db.all(sql, [username], (err, rows) => {
    if (err) throw err;

    if (rows.length > 0) {
      console.log(
        `Welcome, ${rows[0].username}. Your access level is: ${rows[0].level}`
      );
      main();
    }
  });
};

const firstQuestion = () => {
  return new Promise((resolve, reject) => {
    console.log('====================================================');
    console.log(`silakan pilih opsi di bawah ini
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar`);
    console.log('====================================================');
    firstAnswer();
    resolve();
  });
};

const firstAnswer = () => {
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        mahasiswaField();
        break;

      case '2':
        jurusanField();
        break;

      case '3':
        dosenField();
        break;

      case '4':
        matakuliahField();
        break;

      case '5':
        kontrakField();
        break;

      case '6':
        keluar();
        break;

      default:
        firstAnswer();
        break;
    }
  });
};

const mahasiswaField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Murid
[2] Cari Murid
[3] Tambah Murid
[4] Hapus Murid
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarMurid();
        break;

      case '2':
        cariMurid();
        break;

      case '3':
        tambahMurid();
        break;

      case '4':
        hapusMurid();
        break;

      case '5':
        kembali();
        break;

      default:
        mahasiswaField();
        break;
    }
  });
};

const daftarMurid = () => {
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
    mahasiswaField();
  });
};

const cariMurid = () => {
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
      mahasiswaField();
    });
  });
};

const tambahMurid = () => {
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

              daftarMurid();
            });
          });
        });
      });
    });
  });
};

const hapusMurid = () => {
  console.log('====================================================');
  return rl.question('masukkan NIM mahasiswa yang akan dihapus: ', answer => {
    const nim = answer;
    const sql = `DELETE FROM mahasiswas WHERE nim = ?`;

    db.run(sql, nim, err => {
      if (err) throw err;

      daftarMurid();
    });
  });
};

const jurusanField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Jurusan
[2] Cari Jurusan
[3] Tambah Jurusan
[4] Hapus Jurusan
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarJurusan();
        break;

      case '2':
        cariJurusan();
        break;

      case '3':
        tambahJurusan();
        break;

      case '4':
        hapusJurusan();
        break;

      case '5':
        kembali();
        break;

      default:
        jurusanField();
        break;
    }
  });
};

const daftarJurusan = () => {
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
    jurusanField();
  });
};

const cariJurusan = () => {
  console.log('====================================================');
  return rl.question('Masukkan ID Jurusan: ', answer => {
    const sql = `SELECT jurusanId, namajurusan FROM jurusans WHERE jurusans.jurusanId = ?`;
    const idJur = answer;

    db.all(sql, [idJur], (err, row) => {
      if (err) throw err;

      if (row.length > 0) {
        console.log('====================================================');
        console.log('Jurusan details');
        console.log('====================================================');
        console.log(`id       : ${row[0].jurusanId}`);
        console.log(`jurusan  : ${row[0].namajurusan}`);
        console.log('====================================================');
      } else {
        console.log(`jurusan dengan id ${idJur} tidak terdaftar`);
        console.log('====================================================');
      }
      jurusanField();
    });
  });
};

const tambahJurusan = () => {
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

        daftarJurusan();
      });
    });
  });
};

const hapusJurusan = () => {
  console.log('====================================================');
  return rl.question('masukkan ID jurusan yang akan dihapus: ', answer => {
    const jurusanId = answer;
    const sql = `DELETE FROM jurusans WHERE jurusanId = ?`;

    db.run(sql, jurusanId, err => {
      if (err) throw err;

      daftarJurusan();
    });
  });
};

const dosenField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Dosen
[2] Cari Dosen
[3] Tambah Dosen
[4] Hapus Dosen
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarDosen();
        break;

      case '2':
        cariDosen();
        break;

      case '3':
        tambahDosen();
        break;

      case '4':
        hapusDosen();
        break;

      case '5':
        kembali();
        break;

      default:
        dosenField();
        break;
    }
  });
};

const daftarDosen = () => {
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
    dosenField();
  });
};

const cariDosen = () => {
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
      dosenField();
    });
  });
};

const tambahDosen = () => {
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

        daftarDosen();
      });
    });
  });
};

const hapusDosen = () => {
  console.log('====================================================');
  return rl.question('masukkan NIP dosen yang akan dihapus: ', answer => {
    const nip = answer;
    const sql = `DELETE FROM dosens WHERE nip = ?`;

    db.run(sql, nip, err => {
      if (err) throw err;

      daftarDosen();
    });
  });
};

const matakuliahField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Mata Kuliah
[2] Cari Mata Kuliah
[3] Tambah Mata Kuliah
[4] Hapus Mata Kuliah
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarMataKuliah();
        break;

      case '2':
        cariMataKuliah();
        break;

      case '3':
        tambahMataKuliah();
        break;

      case '4':
        hapusMataKuliah();
        break;

      case '5':
        kembali();
        break;

      default:
        matakuliahField();
        break;
    }
  });
};

const daftarMataKuliah = () => {
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
    matakuliahField();
  });
};

const cariMataKuliah = () => {
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
      matakuliahField();
    });
  });
};

const tambahMataKuliah = () => {
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

          daftarMataKuliah();
        });
      });
    });
  });
};

const hapusMataKuliah = () => {
  console.log('====================================================');
  return rl.question('masukkan ID mata kuliah yang akan dihapus: ', answer => {
    const mkId = answer;
    const sql = `DELETE FROM matakuliahs WHERE mkId = ?`;

    db.run(sql, mkId, err => {
      if (err) throw err;

      daftarMataKuliah();
    });
  });
};

const kontrakField = () => {
  console.log('====================================================');
  console.log(`silakan pilih opsi di bawah ini
[1] Daftar Kontrak
[2] Cari Kontrak
[3] Tambah Kontrak
[4] Hapus Kontrak
[5] Kembali`);
  console.log('====================================================');
  return rl.question('masukkan salah satu no, dari opsi diatas: ', answer => {
    switch (answer) {
      case '1':
        daftarKontrak();
        break;

      case '2':
        cariKontrak();
        break;

      case '3':
        tambahKontrak();
        break;

      case '4':
        hapusKontrak();
        break;

      case '5':
        kembali();
        break;

      default:
        kontrakField();
        break;
    }
  });
};

const daftarKontrak = () => {
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
    kontrakField();
  });
};

const cariKontrak = () => {
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
      kontrakField();
    });
  });
};

const tambahKontrak = () => {
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

              daftarKontrak();
            });
          });
        });
      });
    });
  });
};

const hapusKontrak = () => {
  console.log('====================================================');
  return rl.question('masukkan ID kontrak yang akan dihapus: ', answer => {
    const id = answer;
    const sql = `DELETE FROM reports WHERE id = ?`;

    db.run(sql, id, err => {
      if (err) throw err;

      daftarKontrak();
    });
  });
};

const kembali = () => {
  firstQuestion();
};

const keluar = () => {
  console.log('====================================================');
  console.log('Kamu telah keluar.');

  login();
};

const main = async () => {
  await firstQuestion();
};

login();
