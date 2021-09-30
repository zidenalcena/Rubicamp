function indexPrime(param1) {
    var result = [];
    var number = 2;

    while (result.length < param1) {
        var isPrime = true;

        for (var i = 2; i < number; i++) {
            if (number % i === 0) {
                isPrime = false;
            }
        }

        if (isPrime) {
            result.push(number);
        }

        number++;
    }

    return result[result.length - 1];
}

console.log(indexPrime(4));
console.log(indexPrime(500));
console.log(indexPrime(37786));
