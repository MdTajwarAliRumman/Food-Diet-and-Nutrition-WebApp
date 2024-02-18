var age;

function generateDietRecommendations() {

    const bmi = parseFloat(document.getElementById('bmi').value);
    age = parseInt(document.getElementById('age1').value);
    var height = parseFloat(document.getElementById("height").value);
    var weight = parseFloat(document.getElementById("weight").value);
    var gender = document.getElementById("gender").value;
    var activityLevel = document.getElementById("activityLevel").value;

    var calories = calculateCalories(age, gender, weight, height, activityLevel);



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

    var resultText = "You should maintain this calorie: " + calories.toFixed(0) + " kcal/day \n\n";
    document.getElementById("result").innerText = resultText;



    fetch('/diet/model.json')
        .then(response => response.json())
        .then(data => displayDietRecommendations(data, bmi, age, gender))
        .catch(error => console.error('Error fetching data:', error));
}

function displayDietRecommendations(data, bmi, age, gender) {

    const userDietData = data.filter(item =>
        bmi >= item.bmiValue.min && bmi <= item.bmiValue.max &&
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

