
const params = new URLSearchParams(window.location.search);
const foodId = params.get("id");
const food = foods.find(f => f.id === foodId);

if (food) {
  document.getElementById("foodTitle").textContent = food.title;
  document.getElementById("foodDescription").textContent = food.description;
  document.getElementById("foodImage").src = food.image;
  document.getElementById("foodImage").alt = food.title;
  document.getElementById("foodAuthor").textContent = food.author;
  document.getElementById("foodCreatedAt").textContent = food.createdAt;
    const ingredientsList = document.getElementById("ingredientsList");
    ingredientsList.innerHTML = "";
    food.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    const instructionsList = document.getElementById("instructionsList");
    instructionsList.innerHTML = "";
    food.instructions.forEach(instruction => {
        const li = document.createElement("li");
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });
} else {
  document.getElementById("foodTitle").textContent = "Food Not Found";
  document.getElementById("foodDescription").textContent = "The food you are looking for does not exist.";
}
