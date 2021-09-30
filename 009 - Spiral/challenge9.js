function spiral(param1) {
    let index = 0;
    const result = [];

    for (let i = 0; i < param1; i++) {
        const temp = [];
        for (let j = 0; j < param1; j++) {
            temp.push(index);
            index++;
        }
        result.push(temp);
    }

    const spiralNum = [];

    let startCol = 0;
    let endCol = result[0].length;
    let startRow = 1;
    let endRow = result.length;
    let end = param1 - 1;
    let limit = 0;

    while (spiralNum.length < param1 * param1) {
        // ke kanan
        for (let i = startCol; i < endCol; i++) {
            spiralNum.push(result[startCol][i]);
        }

        // ke bawah
        for (let i = startRow; i < endRow; i++) {
            spiralNum.push(result[i][end]);
        }

        // ke kiri
        for (let i = endCol - 2; i >= limit; i--) {
            spiralNum.push(result[end][i]);
        }

        // ke atas
        for (let i = endRow - 2; i > limit; i--) {
            spiralNum.push(result[i][limit]);
        }

        startCol++;
        endCol--;
        startRow++;
        endRow--;
        limit++;
        end--;
    }

    console.log(spiralNum);
}

spiral(5);
spiral(6);
spiral(7);
