// Converts a number from any base to decimal (supports fractions)
function toDecimal(number, base) {
  let [integerPart, fractionalPart] = number.split(".");
  let integerDecimal = parseInt(integerPart, base);

  // Convert fractional part to decimal
  let fractionalDecimal = 0;
  if (fractionalPart) {
    for (let i = 0; i < fractionalPart.length; i++) {
      fractionalDecimal +=
        parseInt(fractionalPart[i], base) / Math.pow(base, i + 1);
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

function displayFormattedResult(value, base, section) {
  const resultElement = document.getElementById(section);
  resultElement.innerHTML = `
    <span class="result-format">
      (<span class="number-part">${value}</span>)
      <sub class="base-part">${base}</sub>
    </span>
  `;
}

// Convert base for input number, supporting fractional numbers
function convertBase() {
  let inputNumber = document.getElementById("inputNumber").value.trim();
  let inputBase = parseInt(document.getElementById("inputBase").value);
  let outputBase = parseInt(document.getElementById("outputBase").value);

  if (inputNumber === "" || isNaN(inputBase) || isNaN(outputBase)) {
    document.getElementById("convertedOutput").textContent = "--";
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
    displayFormattedResult(convertedValue, outputBase, "convertedOutput");

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
  // Create a new input group
  let inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  // Create the number input field
  let numberInput = document.createElement("input");
  numberInput.type = "text";
  numberInput.placeholder = "Enter number";
  numberInput.classList.add("numberInput");

  // Create the base input field for Different Bases mode
  let baseInput = document.createElement("input");
  baseInput.type = "number";
  baseInput.placeholder = "Base";
  baseInput.min = 2;
  baseInput.max = 36;
  baseInput.classList.add("numberBase");

  // Append fields based on selected base mode
  inputGroup.appendChild(numberInput);
  if (
    document.querySelector('input[name="baseMode"]:checked').value ===
    "different"
  ) {
    inputGroup.appendChild(baseInput);
  }

  // Append the input group to the number inputs container
  document
    .getElementById("numberInputs")
    .insertBefore(inputGroup, document.querySelector(".add-number-button"));
}

// Toggle Base Mode to show/hide individual base fields
function toggleBaseMode() {
  let isSameBase =
    document.querySelector('input[name="baseMode"]:checked').value === "same";
  let globalBaseContainer = document.getElementById("globalBaseContainer");
  let baseInputs = document.querySelectorAll(".numberBase");
  let outputBaseContainer = document.getElementById("outputBaseContainer");

  // Show or hide global base field and individual base inputs
  globalBaseContainer.style.display = isSameBase ? "block" : "none";
  baseInputs.forEach(
    (input) => (input.style.display = isSameBase ? "none" : "inline-block")
  );

  // Show or hide output base field
  outputBaseContainer.style.display = isSameBase ? "none" : "block";

  // Show or hide the global base field
  globalBaseContainer.style.display = isSameBase ? "block" : "none";

  // Show or hide individual base inputs next to each number based on selected mode
  baseInputs.forEach(
    (input) => (input.style.display = isSameBase ? "none" : "inline-block")
  );

  // If in Different Bases mode, ensure each input has a base input next to it
  if (!isSameBase) {
    document.querySelectorAll(".numberInput").forEach((input, index) => {
      if (
        !input.nextElementSibling ||
        !input.nextElementSibling.classList.contains("numberBase")
      ) {
        let baseInput = document.createElement("input");
        baseInput.type = "number";
        baseInput.placeholder = "Base";
        baseInput.min = 2;
        baseInput.max = 36;
        baseInput.classList.add("numberBase");
        input.parentNode.insertBefore(baseInput, input.nextSibling);
      }
    });
  }
}

// Calculation function checks if global base is set
function calculate() {
  let operation = document.getElementById("operation").value;
  let isSameBase =
    document.querySelector('input[name="baseMode"]:checked').value === "same";
  let globalBase = parseInt(document.getElementById("globalBase").value);
  let numberInputs = document.querySelectorAll(".numberInput");
  let baseInputs = document.querySelectorAll(".numberBase");
  let outputBase = parseInt(
    document.getElementById("outputBaseArithmetic").value
  );

  // Ensure valid global base in "Same Base" mode
  if (isSameBase && (isNaN(globalBase) || globalBase < 2 || globalBase > 36)) {
    alert("Please enter a valid base (2-36) for Same Base mode.");
    return;
  }

  let values = [];
  try {
    // Convert each number to decimal using global base or individual bases
    numberInputs.forEach((input, index) => {
      let base = isSameBase ? globalBase : parseInt(baseInputs[index].value);
      if (isNaN(base) || base < 2 || base > 36)
        throw "Please enter a valid base (2-36).";

      let decimalValue = toDecimal(input.value.trim(), base);
      if (isNaN(decimalValue)) throw "Invalid number for the specified base.";
      values.push(decimalValue);
    });

    // Perform the specified operation
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

    if (isSameBase) {
      let globalBaseResult = fromDecimal(result, globalBase).toUpperCase();
      displayFormattedResult(globalBaseResult, globalBase, "arithmeticResult");
    } else {
      let outputBaseResult = fromDecimal(result, outputBase).toUpperCase();
      displayFormattedResult(outputBaseResult, outputBase, "arithmeticResult");
    }
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

// Clear all input fields in the arithmetic section and reset to initial state
function clearArithmeticInputs() {
  // Remove all input groups
  let numberInputsDiv = document.getElementById("numberInputs");
  numberInputsDiv.innerHTML = "";

  // Add initial input group with a number input field and, if needed, a base input field
  let inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  let numberInput = document.createElement("input");
  numberInput.type = "text";
  numberInput.placeholder = "Enter number";
  numberInput.classList.add("numberInput");
  inputGroup.appendChild(numberInput);

  // Add base input if Different Bases mode is active
  if (
    document.querySelector('input[name="baseMode"]:checked').value ===
    "different"
  ) {
    let baseInput = document.createElement("input");
    baseInput.type = "number";
    baseInput.placeholder = "Base";
    baseInput.min = 2;
    baseInput.max = 36;
    baseInput.classList.add("numberBase");
    inputGroup.appendChild(baseInput);
  }

  // Append the reset input group and add button back to the numberInputs container
  numberInputsDiv.appendChild(inputGroup);

  // Add back the "Add Another Number" button
  let addButton = document.createElement("button");
  addButton.classList.add("add-number-button");
  addButton.textContent = "Add Another Number";
  addButton.onclick = addNumberInput;
  numberInputsDiv.appendChild(addButton);

  // Clear the result display
  document.getElementById("arithmeticResult").textContent = "--";
}
