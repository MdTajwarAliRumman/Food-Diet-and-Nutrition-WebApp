document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const numberInput = document.getElementById("number");
    const resultContainer = document.getElementById("random");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const numberOfRecommendations = parseInt(numberInput.value, 10);

        if (isNaN(numberOfRecommendations) || numberOfRecommendations < 1 || numberOfRecommendations > 12) {
            alert("Please enter a valid number between 1 and 12.");
            return;
        }

        resultContainer.innerHTML = ""; // Clear previous results

        fetch("/diet/mdell.json")
            .then(response => response.json())
            .then(data => generateRecommendations(data, numberOfRecommendations))
            .catch(error => console.error("Error fetching data:", error));
    });

    function generateRecommendations(data, numberOfRecommendations) {
        const randomRecommendations = getRandomRecommendations(data, numberOfRecommendations);

        randomRecommendations.forEach(food => {
            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${food}</h5>
                    </div>
                </div>
            `;
            resultContainer.appendChild(card);
        });
    }

    function getRandomRecommendations(data, numberOfRecommendations) {
        const recommendations = data[Math.floor(Math.random() * data.length)].recFood;
        const allFoods = Object.values(recommendations);
        shuffleArray(allFoods);

        return allFoods.slice(0, numberOfRecommendations);
    }


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
