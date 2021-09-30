const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Tulis kalimatmu disini > '
});

rl.prompt();

rl.on('line', answer => {
    const splitted = [];
    let splitting = '';
    let lastWord = '';

    for (let i = 0; i < answer.length; i++) {
        if (answer[i] === ' ') {
            splitted.push(splitting);
            splitting = '';
        } else splitting += answer[i];
    }

    for (let i = 0; i < answer.length; i++) {
        if (answer[i] === ' ') lastWord = '';
        else lastWord += answer[i];
    }

    splitted.push(lastWord);

    const result = [];

    for (let i = 0; i < splitted.length; i++) {
        const vocal = 'aiueo';
        let isVocal = false;

        for (let j = 0; j < vocal.length; j++)
            if (splitted[i][0] === vocal[j]) isVocal = true;

        let temp = '';

        if (isVocal) temp = splitted[i];
        else {
            for (let k = 1; k < splitted[i].length; k++) {
                temp += splitted[i][k];
            }
            temp += `${splitted[i][0]}nyo`;
        }

        result.push(temp);
    }

    let final = '';

    for (let i = 0; i < result.length; i++) {
        if (i === result.length - 1) final += result[i];
        else final += `${result[i]} `;
    }

    console.log(`Hasil konversi: ${final}`);

    rl.prompt();
}).on('close', () => {
    console.log('Good Bye!');
    process.exit(0);
});
