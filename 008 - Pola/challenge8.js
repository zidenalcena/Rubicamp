function pola(str) {
    let splitted = [];
    let splitting = '';

    for (let i = 0; i < str.length; i++) {
        if (str[i] === ' ') {
            i++;
            splitted.push(splitting);
            splitting = '';
        }
        splitting += str[i];
    }

    let last = '';

    for (let j = 0; j < str.length; j++) {
        last += str[j];
        if (str[j] === ' ' || str[j] === '*' || str[j] === '=') {
            last = '';
        }
    }

    splitted.push(last);

    let box = [];

    for (let k = 0; k < splitted.length; k++) {
        if (k !== 1 && k !== 3) {
            box.push(splitted[k]);
        }
    }

    // console.log(box);
    let temp = [];

    for (let l = 0; l < box.length; l++) {
        for (let m = 0; m < box[l].length; m++) {
            if (box[l][m] === '#') {
                temp.push(box[l]);
            }
        }
    }

    // console.log(temp);

    let secondNum = Number(box[1]);
    // console.log(secondNum);

    let strNumOne = '';
    let strNumTwo = '';

    for (let n = 0; n < temp[0].length; n++) {
        strNumOne += temp[0][n];
    }

    for (let o = 0; o < temp[1].length; o++) {
        strNumTwo += temp[1][o];
    }

    // console.log(strNumOne);
    // console.log(strNumTwo);

    let result = [];

    for (let r = 0; r < 10; r++) {
        let firstNum = strNumOne.replace(/#/, r);
        for (let s = 0; s < 10; s++) {
            let thirdNum = strNumTwo.replace(/#/, s);
            if (Number(firstNum) * secondNum === Number(thirdNum)) {
                result.push(r, s);
            }
        }
    }

    return result;
}

console.log(pola('42#3 * 188 = 80#204'));
console.log(pola('8#61 * 895 = 78410#5'));
