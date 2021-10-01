const fs = require('fs');
const readline = require('readline');

const file = fs.readFileSync('./data.json');
const data = JSON.parse(file);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Tebakan: '
});

console.log(
  'Selamat datang di permainan Tebak Kata, silakan isi dengan jawaban yang benar!\n'
);

let count = 0;

console.log(`Pertanyaan: ${data[count].definition}`);
rl.prompt();

rl.on('line', line => {
  if (count < data.length - 1) {
    if (line.toLowerCase() !== data[count].term) {
      console.log('Wkwkwk, Anda kurang beruntung!\n');
      rl.prompt();
    } else {
      count++;
      console.log('Selamat Anda benar!\n');
      console.log(`Pertanyaan: ${data[count].definition}`);
      rl.prompt();
    }
  } else {
    if (line.toLowerCase() !== data[count].term) {
      console.log('Wkwkwk, Anda kurang beruntung!\n');
      rl.prompt();
    } else {
      console.log('Selamat Anda benar!\n');
      console.log('Hore Anda Menang!');
      process.exit(0);
    }
  }
});
