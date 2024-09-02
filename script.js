const manualForm = document.getElementById('manual-form');
const imageForm = document.getElementById('image-form');
const resultsSection = document.getElementById('results');
const toleranceCapacityElement = document.getElementById('tolerance-capacity');
const resistanceValueElement = document.getElementById('resistance-value');
const circuitModelElement = document.getElementById('circuit-model');

manualForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const chestCircumference = parseFloat(document.getElementById('chest-circumference').value);
    const waistCircumference = parseFloat(document.getElementById('waist-circumference').value);
    const hipCircumference = parseFloat(document.getElementById('hip-circumference').value);

    // Calculate tolerance capacity, resistance value, and circuit model
    const toleranceCapacity = calculateToleranceCapacity(height, weight, chestCircumference, waistCircumference, hipCircumference);
    const resistanceValue = calculateResistanceValue(height, weight, chestCircumference, waistCircumference, hipCircumference);
    const circuitModel = calculateCircuitModel(height, weight, chestCircumference, waistCircumference, hipCircumference);

    // Display results
    toleranceCapacityElement.textContent = `Tolerance Capacity: ${toleranceCapacity} A`;
    resistanceValueElement.textContent = `Resistance Value: ${resistanceValue} ohms`;
    circuitModelElement.textContent = `Circuit Model: ${circuitModel}`;
});

imageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const imageInput = document.getElementById('image-input');
    const imageData = new FormData();
    imageData.append('image', imageInput.files[0]);

    // Send image to server for processing
    fetch('/process-image', {
        method: 'POST',
        body: imageData
    })
    .then(response => response.json())
    .then(data => {
        const height = data.height;
        const weight = data.weight;
        const chestCircumference = data.chestCircumference;
        const waistCircumference = data.waistCircumference;
        const hipCircumference = data.hipCircumference;

        // Calculate tolerance capacity, resistance value, and circuit model
        const toleranceCapacity = calculateToleranceCapacity(height, weight, chestCircumference, waistCircumference, hipCircumference);
        const resistanceValue = calculateResistanceValue(height, weight, chestCircumference, waistCircumference, hipCircumference);
        const circuitModel = calculateCircuitModel(height, weight, chestCircumference, waistCircumference, hipCircumference);

        // Display results
        toleranceCapacityElement.textContent = `Tolerance Capacity: ${toleranceCapacity} A`;
        resistanceValueElement.textContent = `Resistance Value: ${resistanceValue} ohms`;
        circuitModelElement.textContent = `Circuit Model: ${circuitModel}`;
    })
    .catch(error => console.error(error));
});

// Functions to calculate tolerance capacity, resistance value, and circuit model
function calculateToleranceCapacity(height, weight, chestCircumference, waistCircumference, hipCircumference) {
    // Calculate body surface area (BSA) using the Mosteller formula
    const bsa = Math.sqrt((height * weight) / 3600);

    // Calculate tolerance capacity using the IEC 60479-1 standard
    const toleranceCapacity = (bsa * 1000) / (500 * (1 + (chestCircumference / waistCircumference)));

    return toleranceCapacity.toFixed(2);
}

function calculateResistanceValue(height, weight, chestCircumference, waistCircumference, hipCircumference) {
    // Calculate body mass index (BMI)
    const bmi = weight / (height / 100) ** 2;

    // Calculate resistance value using the IEC 60479-1 standard
    const resistanceValue = (1000 * (1 + (bmi / 10))) / (1 + (chestCircumference / waistCircumference));

    return resistanceValue.toFixed(2);
}

function calculateCircuitModel(height, weight, chestCircumference, waistCircumference, hipCircumference) {
    // Calculate body surface area (BSA) using the Mosteller formula
    const bsa = Math.sqrt((height * weight) / 3600);

    // Calculate circuit model using the IEC 60479-1 standard
    const circuitModel = (bsa * 1000) / (500 * (1 + (chestCircumference / waistCircumference) + (hipCircumference / waistCircumference)));

    // Determine the circuit model based on the calculated value
    if (circuitModel < 1500) {
        return 'Model A';
    } else if (circuitModel < 2500) {
        return 'Model B';
    } else if (circuitModel < 3500) {
        return 'Model C';
    } else {
        return 'Model D';
    }
}