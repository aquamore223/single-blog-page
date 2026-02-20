const grid = document.getElementById("foodGrid");

foods.forEach(food => {
  const card = document.createElement("div");
  card.className = "grid-card";

  card.innerHTML = `
    <div class="category-card">
      <img src="${food.image}" alt="${food.title}">
      <span>${food.author}</span> <span>${food.createdAt}</span>
      <h3>${food.title}</h3>
      <p>${food.description}</p>
    </div>
    <a href="food-details.html?id=${food.id}">
      <button>Read More</button>
    </a>
  `;

  grid.appendChild(card);
});

