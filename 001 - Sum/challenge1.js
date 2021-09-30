function sum() {
    var total = 0;

    for (var i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }

    console.log(total);
}
sum(1, 2, 7);
sum(1, 4);
sum(11);
sum(10, 3, 6, 7, 9);