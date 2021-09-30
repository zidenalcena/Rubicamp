function sentencesManipulation(sentence) {
    var splitted = [];
    var splitting = '';
    var lastWord = '';

    for (var x = 0; x < sentence.length; x++) {
        if (sentence[x] === ' ') {
            splitted.push(splitting);
            splitting = '';
        } else splitting += sentence[x];
    }

    for (var y = 0; y < sentence.length; y++) {
        if (sentence[y] === ' ') lastWord = '';
        else lastWord += sentence[y];
    }

    splitted.push(lastWord);

    var result = [];

    for (var i = 0; i < splitted.length; i++) {
        var vocal = 'aiueo';
        var isVocal = false;

        for (var j = 0; j < vocal.length; j++)
            if (splitted[i][0] === vocal[j]) isVocal = true;

        var temp = '';

        if (isVocal) temp = splitted[i];
        else {
            for (var k = 1; k < splitted[i].length; k++) temp += splitted[i][k];

            temp += `${splitted[i][0]}nyo`;
        }

        result.push(temp);
    }

    var final = '';

    for (var l = 0; l < result.length; l++) {
        if (l === result.length - 1) final += result[l];
        else final += `${result[l]} `;
    }

    console.log(final);
}

sentencesManipulation('ibu pergi ke pasar bersama aku');
