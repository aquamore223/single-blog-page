const foods = JSON.parse(localStorage.getItem("foods")) || [];

foods.push({
  title: 8titleInput.value,
  image: imageInput.value,
  description: descInput.value,
  link: "food-details.html"
});

localStorage.setItem("foods", JSON.stringify(foods));
