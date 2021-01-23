function brickWork(width, length, ...firstLayers) {
    // The solution I came up with is based on the fact that N and M are always even numbers. if N and M are always even we can split our solution(second) layout of bricks in simple 2x2 squares. 
    // In every 2x2 square there can be maximum of 2 whole bricks and in every square the whole bricks can either be placed horizontal or vertical. 
    // In some cases only 1 whole brick will be in this square or even 0 whole bricks and 4 halves but the general rule that there can only be one direction of the bricks in 2x2 square still applies.
    // Following all the above we can conclude that there always is solution when N and M are even numbers.

    let firstLayer = firstLayers.reduce((a, b) => a + ` ` + b)

    // Here we split the input string to turn it into array so we can easily work with it. If the input layers are not given as a single string but a couple of strings first we concatenate them.
    let layout = firstLayer.split(` `).map(Number);
    let result = [];

    if (validation(width, length, layout, firstLayers) != "validated") { // Here we check if all conditions are met.
        return console.log(validation(width, length, layout, firstLayers))
    }

    for (let i = 0; i < layout.length; i++) {
        // We do this check to see if there is already a brick in this position and avoid replacing bricks.
        if (result[i] == undefined) {

            // We always check if there is a brick in this 2x2 square with direction (usually there is but there are some variations where there is no whole brick in the square)
            let direction = squareDirection(layout[i], layout[i + 1], layout[i + length], layout[i + length + 1]);

            // We always use the opposite direction than the one of the first layer/base. This way we never get 2 bricks from diferent layers in same position.
            if (direction == "horizontal") {

                // As we need specific elements/numbers in specific position it is easier to directly assign the element/number to its position. Same apply for the "else" statement below. If direction is "horizontal" we place the bricks "vertical" and vice versa. We also do 4 elements at a time as it is easier to do whole 2x2 square simultaneously.
                result[i] = brickGenerator(result);
                result[i + 1] = brickGenerator(result);
                result[i + length] = result[i];
                result[i + length + 1] = result[i + 1];
            } else {
                result[i] = brickGenerator(result);
                result[i + 1] = result[i];
                result[i + length] = brickGenerator(result);
                result[i + length + 1] = result[i + length];
            }
        }
    }


    function brickGenerator(arr) { // As brick numbers are used only for direction(horizontal/vertical brick position) we are not looking for specific brick numbering and can use this brick generator to create a brick whenever we need one.
        let lastBrick;

        // We use slice method to copy the array.
        let newArr = arr.slice();

        // We need this check only for the first brick as at this point our array is empty
        if (newArr.length == 0) {
            lastBrick = 0;
        } else {
            // We do this sort to get the biggest number in our array which happens to be the last one too.
            lastBrick = newArr.sort((a, b) => b - a)[0];
        }

        let newBrick = Number(lastBrick) + 1;

        return newBrick;
    }

    function squareDirection(x1, x2, y1, y2) { // This show us if the 2x2 square have a whole brick with direction inside.
        let direction = "";
        let topLeftElement = x1;
        let topRigthElement = x2;
        let bottomLeftElement = y1;
        let bottomRightElement = y2;

        if (topLeftElement == topRigthElement || bottomLeftElement == bottomRightElement) {
            direction = "horizontal";
        } else {
            direction = "vertical";
        }

        return direction;
    }

    function validation(width, length, layout, firstLayers) { //Here is all the validation code.

        if (width % 2 !== 0 || length % 2 !== 0) {
            return (`Width or/and length are not even numbers! Please recheck.`); 
        }
        if (width == 0 || length == 0) {
            return (`Width or/and length = 0! No bricks are layed! Please recheck.`);
        }
        if (Number(width) * Number(length) > 100) {
            return (`Layer area exceeding 100! Please recheck.`);
        }
        if (!columnsValidator(length, firstLayers)) {
            return (`Colums not accurate! Please recheck.`);
        }
        if (firstLayers.length !== width) {
            return (`Rows not accurate! Please recheck.`);
        }
        if (!brickOcurances(layout)) {
            return (`There is an unusual brick spanning ! Please recheck.`);
        }
        else{
            return `validated`;
        }

        function columnsValidator(length, firstLayers) {
            let lengthValidationArray = [];

            firstLayers.forEach(e =>
                lengthValidationArray.push(e.split(` `).length)
            )

            return (lengthValidationArray.every((val, i, arr) => val === length)) // return boolean to validate length
        }

        function brickOcurances(arr) {
            let newArr = arr.slice();

            const count = {}; // We need this object to validate bricks ocurances
            newArr.forEach(e => count[e] ? count[e]++ : count[e] = 1);

            let countArr = Object.values(count);

            return (countArr.every((val, i, arr) => val === 2));
        }

    }

    function resultPrinter(length, result) {
        for (let i = 0; i < result.length; i += length) {
            let singleLine = result.slice(i, i + length);
            singleLine = singleLine.join(`*`).match(/\d+|\*/g);

            for (let i = 0; i < singleLine.length; i+=2) {
                if (singleLine[i] == singleLine[i+2]) {
                    singleLine.splice(i+1, 1, `:`);
                }
            }

            singleLine = singleLine.join(``);
            console.log(singleLine);
        }
    }

    resultPrinter(length, result)

}

// brickWork(2,4, `1 1 1 2 2`, `3 3 4 4`)
// brickWork(2,4, `1 1 2 2`, `3 3 4 4`, `1 1 2 2`)
// brickWork(2,4, `1 1 1 2`, `3 3 4 4`)
// brickWork(2, 8, `1 2 2 12 5 7 7 16`, `1 10 10 12 5 15 15 16`)
brickWork(4, 8, `1 2 2 12 5 7 7 16`, `1 10 10 12 5 15 15 16`, `9 9 3 4 4 8 8 14`, `11 11 3 13 13 6 6 14`)
