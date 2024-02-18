function calculateBMI(event) {

    event.preventDefault();
    var name = document.getElementById("name").value;
    var age = parseFloat(document.getElementById("age1").value);
    var height = parseFloat(document.getElementById("height").value);
    var weight = parseFloat(document.getElementById("weight").value);
    var gender = document.getElementById("gender").value;
    var activityLevel = document.getElementById("activityLevel").value;

    var heightInMeters = height / 100;
    var bmi = weight / (heightInMeters * heightInMeters);
    bmi = bmi.toFixed(2);


    var bmiRange = getBmiRange(bmi);


    var weightStatus;
    var targetWeight;
    var weightChange;
    var calories;
    var calories1 = 0;
    var healthyBmi;

    switch (bmiRange) {
        case "Underweight":
            weightStatus = "You are Underweight. Consider gaining weight.";
            targetWeight = 18.5 * heightInMeters * heightInMeters;
            weightChange = targetWeight - weight;
            calories1 = calculateCalories(age, gender, weight, height, activityLevel);
            calories = calculateCalories(age, gender, targetWeight, height, activityLevel);
            healthyBmi = targetWeight / (heightInMeters * heightInMeters);
            break;

        case "Normal Weight":
            weightStatus = "Perfect! You have a Healthy BMI.";
            targetWeight = weight;
            weightChange = 0;
            healthyBmi = targetWeight / (heightInMeters * heightInMeters);
            calories1 = calculateCalories(age, gender, weight, height, activityLevel);
            calories = calculateCalories(age, gender, weight, height, activityLevel);

            resultText = `${name}'s BMI is: ${bmi} kg/m2\n\nWeight Status: ${weightStatus}\n\nAt present you maintain ${calories1.toFixed(2)} kcal/day Calories\n\n`;

            document.getElementById("caloriesChart").style.display = "none";
            document.getElementById("caloriesTable").style.display = "none";
            break;

        case "Overweight":
            weightStatus = "You are Overweight. Consider losing weight.";
            targetWeight = 24.9 * heightInMeters * heightInMeters;
            weightChange = weight - targetWeight;
            calories1 = calculateCalories(age, gender, weight, height, activityLevel);
            calories = calculateCalories(age, gender, targetWeight, height, activityLevel);
            healthyBmi = targetWeight / (heightInMeters * heightInMeters);
            break;

        case "Obese":
            weightStatus = "You are Obese. Consider losing weight for a healthier lifestyle.";
            targetWeight = 24.9 * heightInMeters * heightInMeters;
            weightChange = weight - targetWeight;
            calories1 = calculateCalories(age, gender, weight, height, activityLevel);
            calories = calculateCalories(age, gender, targetWeight, height, activityLevel);
            healthyBmi = targetWeight / (heightInMeters * heightInMeters);
            break;

        default:
            weightStatus = "Unable to determine weight status.";
            targetWeight = weight;
            weightChange = 0;
            calories = calculateCalories(age, gender, weight, height, activityLevel);
            healthyBmi = targetWeight / (heightInMeters * heightInMeters);
            break;
    }

    // Display results
    var resultText = name + "'s BMI is: " + bmi + " kg/m2\n\n";

    resultText += "Weight Status: " + weightStatus + "\n\n";
    resultText += "At present you maintain " + calories1.toFixed(2) + " kcal/day Calories \n\n";
    resultText += "Perfect Weight for you: " + targetWeight.toFixed(2) + " kg\n\n";

    resultText += "You should Maintained " + calories.toFixed(2) + " kcal/day this Calories \n\n";

    document.getElementById("result").innerText = resultText;




    var cardElement = document.createElement('div');
    cardElement.className = 'col';
    cardElement.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title text-center mb-2">Are you Satisfied with your BMI?</h5>
               
                <div class="d-flex justify-content-around align-items-center mt-2 mb-3">
                    <div><a href="index.html" class="btn custom-button-bg text-white py-3">Yes (Back to Home)</a></div>
                    <div><a href="dietFood.html" class="btn custom-button-bg text-white">Custom food recommendation <br> <span class="small-font">based on you expected BMI</span> </a></div>
                </div>
            </div>
        </div>
    `;

    // Append the card to the container
    var cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = ''; // Clear previous results
    cardContainer.appendChild(cardElement);




    fetch('/diet/model.json')
        .then(response => response.json())
        .then(data => displayDietRecommendations(data, healthyBmi, age, gender))
        .catch(error => console.error('Error fetching data:', error));


    displayCaloriesChart(weight, targetWeight);
    displayCaloriesTable(targetWeight, calories);

}

function displayCaloriesChart(currentWeight, targetWeight) {

    var ctx = document.getElementById('caloriesChart').getContext('2d');

    // Chart data
    var data = {
        labels: ['Current Weight', 'Target Weight'],
        datasets: [{
            label: 'Weight Progress',
            backgroundColor: ['#ff9999', '#66b3ff'],
            data: [currentWeight, targetWeight]
        }]
    };

    // Chart configuration
    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Create the chart
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function displayCaloriesTable(targetWeight, calories) {

    var tableElement = document.getElementById('caloriesTable');

    // Clear previous table content
    tableElement.innerHTML = '';

    // Create table rows
    var rows = [
        ['Target Weight', targetWeight.toFixed(2) + ' kg'],
        ['Calories per Day', calories.toFixed(2) + ' kcal'],
        ['Calories per Day (10 Days)', (calories * 10).toFixed(2) + ' kcal'],
        ['Calories per Day (20 Days)', (calories * 20).toFixed(2) + ' kcal'],
        ['Calories per Day (30 Days)', (calories * 30).toFixed(2) + ' kcal']
    ];


    rows.forEach(row => {
        var tr = document.createElement('tr');
        row.forEach(cell => {
            var td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableElement.appendChild(tr);
    });
}

function getBmiRange(bmi) {
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi < 24.99) {
        return "Normal Weight";
    } else if (bmi < 29.99) {
        return "Overweight";
    } else {
        return "Obese";
    }
}

function calculateCalories(age, gender, weight, height, activityLevel) {

    var baseCalories = (gender === "male") ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    var activityMultiplier = getActivityMultiplier(activityLevel);
    var calories = baseCalories * activityMultiplier;
    return calories;
}

function getActivityMultiplier(activityLevel) {

    switch (activityLevel) {
        case "sedentary":
            return 1.2;
        case "lightlyActive":
            return 1.375;
        case "moderatelyActive":
            return 1.55;
        case "veryActive":
            return 1.725;
        default:
            return 1.2;
    }
}



function displayDietRecommendations(data, healthyBmi, age, gender) {

    const userDietData = data.filter(item =>
        healthyBmi >= item.bmiValue.min && healthyBmi <= item.bmiValue.max &&
        age >= item.age.min && age <= item.age.max &&
        gender === item.gender
    );


    const dietFoodRecElement = document.getElementById('dietFoodRec');
    dietFoodRecElement.innerHTML = ''; // Clear previous recommendations

    userDietData.forEach(item => {
        const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];

        mealTypes.forEach(mealType => {
            const mealData = item.meals[mealType];


            const imageUrl = getImageUrlForMealType(mealType);

            const cardElement = document.createElement('div');
            cardElement.className = 'col';
            cardElement.innerHTML = `
            

                <div class="card">
                    <img src="${imageUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-center">${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5>
                        ${mealData.map((food, index) => `
                            <div class="">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <p><span class="fw-bold">${index + 1}.</span> ${food.food}</p>
                                        <p><span class="fw-bold">Calories :</span> ${food.calories}</p>
                                    </li>
                                </ul>
                                <hr>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            dietFoodRecElement.appendChild(cardElement);
        });
    });




    function getImageUrlForMealType(mealType) {


        if (mealType === 'breakfast') {
            return 'https://img.freepik.com/free-photo/english-breakfast-fried-eggs-sausages-zucchini-sweet-peppers_2829-19900.jpg?w=740&t=st=1703239168~exp=1703239768~hmac=b160fb156683a582252e297a99efa411a03aa928d94dccfe757bc0e9ce6098bd';
        } else if (mealType === 'lunch') {
            return 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?w=740&t=st=1703239242~exp=1703239842~hmac=9fd1eb115ccf13de65bb3d89501143c006b5c00b1f308f75e6ccced583f42754';
        } else if (mealType === 'snacks') {
            return 'https://img.freepik.com/free-photo/pretzels-chips-crackers-popcorn-bowls_114579-6490.jpg?w=740&t=st=1703239331~exp=1703239931~hmac=1eff8fdffc0d1caa4b41b4e1f353caebe7c0ba32d7c1e3a3e57c21402e61e373';
        } else if (mealType === 'dinner') {
            return 'https://img.freepik.com/free-photo/roasted-pork-steak-vegetables-plate_1150-45293.jpg?w=740&t=st=1703239530~exp=1703240130~hmac=1856fc9633b36c16dd59753fc9afc488f4da01c78d917222e6cc4ca94f2524c6';
        } else {

            return 'https://img.freepik.com/free-photo/front-view-cooked-rice-with-dough-slices-dark-surface-dish-meal-dark-food-photo_140725-81864.jpg?w=740&t=st=1703233990~exp=1703234590~hmac=62a5d60a4b260b9f6fd6456bb5b96e3ac8c6460b1785638ca99cd9e418db377d';
        }
    }

}


