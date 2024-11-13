// Converts a number from any base to decimal (supports fractions)
function toDecimal(number, base) {
    let [integerPart, fractionalPart] = number.split(".");
    let integerDecimal = parseInt(integerPart, base);

    // Convert fractional part to decimal
    let fractionalDecimal = 0;
    if (fractionalPart) {
        for (let i = 0; i < fractionalPart.length; i++) {
            fractionalDecimal += parseInt(fractionalPart[i], base) / Math.pow(base, i + 1);
        }
    }

    return integerDecimal + fractionalDecimal;
}

// Converts a decimal number to any base (supports fractional output)
function fromDecimal(decimal, base, precision = 10) {
    let integerPart = Math.floor(decimal);
    let fractionalPart = decimal - integerPart;

    // Convert integer part to target base
    let integerStr = integerPart.toString(base);

    // Convert fractional part to target base
    let fractionalStr = "";
    while (fractionalPart > 0 && fractionalStr.length < precision) {
        fractionalPart *= base;
        let digit = Math.floor(fractionalPart);
        fractionalStr += digit.toString(base);
        fractionalPart -= digit;
    }

    return fractionalStr ? `${integerStr}.${fractionalStr}` : integerStr;
}

// Convert base for input number, supporting fractional numbers
function convertBase() {
    let inputNumber = document.getElementById("inputNumber").value.trim();
    let inputBase = parseInt(document.getElementById("inputBase").value);
    let outputBase = parseInt(document.getElementById("outputBase").value);

    if (inputNumber === '' || isNaN(inputBase) || isNaN(outputBase)) {
        document.getElementById("convertedOutput").textContent = '--';
        document.getElementById("conversionTable").innerHTML = `
            <td>--</td><td>--</td><td>--</td><td>--</td>
        `;
        return;
    }

    try {
        // Convert input number to decimal
        let decimalValue = toDecimal(inputNumber, inputBase);

        // Convert decimal to output base
        let convertedValue = fromDecimal(decimalValue, outputBase);
        document.getElementById("convertedOutput").textContent = convertedValue;

        // Update universal table for other bases
        document.getElementById("conversionTable").innerHTML = `
            <td>${fromDecimal(decimalValue, 2)}</td>
            <td>${fromDecimal(decimalValue, 8)}</td>
            <td>${decimalValue}</td>
            <td>${fromDecimal(decimalValue, 16).toUpperCase()}</td>
        `;
    } catch (error) {
        alert(error);
    }
}

// Add another input field for arithmetic operations above the button
function addNumberInput() {
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter number";
    inputField.classList.add("numberInput");
    // inputField.setAttribute("oninput", "calculate()"); // Bind the instant calculation to new input

    let numberInputsDiv = document.getElementById("numberInputs");
    numberInputsDiv.insertBefore(inputField, document.querySelector(".add-number-button"));
}

// Perform arithmetic operations on multiple base numbers (supporting fractions)
function calculate() {
    let operation = document.getElementById("operation").value;
    let base = parseInt(document.getElementById("arithmeticBase").value);
    let numberInputs = document.querySelectorAll(".numberInput");

    if (isNaN(base) || base < 2 || base > 36) {
        alert("Please enter a valid base (between 2 and 36).");
        return;
    }

    let values = [];
    try {
        numberInputs.forEach(input => {
            let value = toDecimal(input.value.trim(), base);
            if (isNaN(value)) throw "Invalid number for the specified base.";
            values.push(value);
        });

        let result;
        if (operation === "add") {
            result = values.reduce((a, b) => a + b, 0);
        } else if (operation === "subtract") {
            result = values.reduce((a, b) => a - b);
        } else if (operation === "multiply") {
            result = values.reduce((a, b) => a * b, 1);
        } else if (operation === "divide") {
            result = values.reduce((a, b) => a / b);
        }

        // Display result in the specified base
        document.getElementById("arithmeticResult").textContent = fromDecimal(result, base).toUpperCase();
    } catch (error) {
        alert(error);
    }
}

// Clear all input fields in the conversion section
function clearConversionInputs() {
    document.getElementById("inputNumber").value = "";
    document.getElementById("inputBase").value = 10;
    document.getElementById("outputBase").value = 16;
    document.getElementById("convertedOutput").textContent = "--";
    document.getElementById("conversionTable").innerHTML = `
        <td>--</td><td>--</td><td>--</td><td>--</td>
    `;
}

// Clear all input fields in the arithmetic section
// function clearArithmeticInputs() {
//     document.querySelectorAll(".numberInput").forEach(input => input.value = "");
//     document.getElementById("arithmeticResult").textContent = "--";
//     let inputField = document.createElement("input");
//     inputField.type = "text";
//     inputField.placeholder = "Enter number";
//     inputField.classList.add("numberInput");
// }

// Clear all input fields in the arithmetic section, keeping only the initial one
function clearArithmeticInputs() {
    // Select all dynamically added input fields and remove them
    const numberInputsDiv = document.getElementById("numberInputs");
    numberInputsDiv.innerHTML = ""; // Clear all inputs

    // Re-create the original input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter number";
    inputField.classList.add("numberInput");

    // Append the original input field back to the container
    numberInputsDiv.appendChild(inputField);

    // Add back the "Add Another Number" button
    const addButton = document.createElement("button");
    addButton.classList.add("add-number-button");
    addButton.textContent = "Add Another Number";
    addButton.onclick = addNumberInput;
    numberInputsDiv.appendChild(addButton);

    // Clear the result display
    document.getElementById("arithmeticResult").textContent = "--";
}
