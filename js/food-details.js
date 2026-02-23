import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@latest/dist/pocketbase.es.mjs';

const pb = new PocketBase('https://itrain.services.hodessy.com');

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const foodId = params.get('id');

async function loadFoodDetails() {
    if (!foodId) {
        console.error("No ID in URL");
        return;
    }

    try {
        const food = await pb.collection('famousblog').getOne(foodId);


        let imageUrl = 'https://via.placeholder.com/500x300';

        if (food.image) {
           imageUrl = food.image;
        }

        document.getElementById('foodImage').src = imageUrl;
        document.getElementById('foodImage').alt = food.title || '';

        //  TEXT DATA
        document.getElementById('foodTitle').textContent = food.title || '';
        document.getElementById('foodDescription').textContent = food.description || '';
        document.getElementById('foodAuthor').textContent = `By ${food.author || 'Unknown'}`;
        document.getElementById('foodCreatedAt').textContent =
            food.created ? new Date(food.created).toLocaleDateString() : '';

      // INGREDIENTS
const ingredientsList = document.getElementById('ingredientsList');
ingredientsList.innerHTML = "";

if (food.ingredients) {
    const ingredientsArray = food.ingredients.replace(/"/g, '').split(",");

    ingredientsArray.forEach(item => {
        if (item.trim()) {
            const li = document.createElement("li");
            li.textContent = item.trim();
            ingredientsList.appendChild(li);
        }
    });

}
    else {  
    ingredientsList.innerHTML = "<li>No ingredients available</li>";
    }



         
       // INSTRUCTIONS
        const instructionsList = document.getElementById('instructionsList');
        instructionsList.innerHTML = "";

        if (food.instructions) {
            const instructionsArray = food.instructions.replace(/"/g, '').split(".");

            instructionsArray.forEach(step => {
                if (step.trim()) {
                    const li = document.createElement("li");
                    li.textContent = step.trim();
                    instructionsList.appendChild(li);
                }
            });
    


        } else {
            instructionsList.innerHTML = "<li>No instructions available</li>";
        }

    } catch (error) {
        console.error("Error loading details:", error);
    }

   
}

loadFoodDetails();

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}
