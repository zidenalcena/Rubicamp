function weirdMultiply(number) {
    var stringNumber = number.toString();

    if (stringNumber.length === 1) return Number(stringNumber);

    var result = 1;

    for (var i = 0; i < stringNumber.length; i++)
        result *= Number(stringNumber[i]);

    return weirdMultiply(result);
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));
