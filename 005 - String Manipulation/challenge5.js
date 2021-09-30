function stringManipulation(word) {
    var vocal = 'aiueo';
    var isVocal = false;

    for (var i = 0; i < vocal.length; i++) {
        if (word[0] === vocal[i]) {
            isVocal = true;
        }
    }

    var result = '';

    if (isVocal) {
        result = word;
    } else {
        for (var i = 1; i < word.length; i++) {
            result += word[i];
        }

        result += `${word[0]}nyo`;
    }

    console.log(result);
}

stringManipulation('ayam');
stringManipulation('bebek');
