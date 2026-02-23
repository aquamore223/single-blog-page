import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@latest/dist/pocketbase.es.mjs';
const pb = new PocketBase('https://itrain.services.hodessy.com');

document.addEventListener("DOMContentLoaded", () => {

  // Load header dynamically
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

      // Attach hamburger listener
      const menuToggle = document.getElementById("menuToggle");
      const navMenu = document.getElementById("navMenu");
      if(menuToggle && navMenu){
          menuToggle.addEventListener("click", () => {
              navMenu.classList.toggle("active");
          });
      }

      // Attach search listeners
      attachSearchListeners();
    });

  // Load footer dynamically
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

  // Load blogs
  loadBlogs();
});

async function loadBlogs() {
    try {
        const result = await pb.collection('famousblog').getList(1, 20);
        const container = document.getElementById("foodGrid");
        if (!container) return console.error("Container #foodGrid not found");

        let html = "";
        result.items.forEach(blog => {
            const imageUrl = blog.image || 'https://via.placeholder.com/300x200?text=No+Image';
            const author = blog.author || "Unknown";
            const date = blog.created ? new Date(blog.created).toLocaleDateString() : "";

            html += `
                <div class="category-card blog-card">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${blog.title}">
                    </div>
                    <h3>${blog.title}</h3>
                    <p>${blog.description || ''}</p>
                    <p class="blog-meta"><strong>${author}</strong> | <small>${date}</small></p>
                    <a href="food-details.html?id=${blog.id}">
                        <button>View Details</button>
                    </a>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (error) {
        console.error("Error loading blogs:", error);
    }
}

// Search function
function attachSearchListeners() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    if(!searchInput || !searchBtn) return;

    async function searchFood() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return alert("Type something to search");

        try {
            const result = await pb.collection("famousblog").getList(1, 50);
            const match = result.items.find(food =>
                food.title.toLowerCase().includes(query)
            );
            if (match) {
                window.location.href = `food-details.html?id=${match.id}`;
            } else {
                alert("Food not found go to category page to view all foods");
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    }

    searchBtn.addEventListener("click", searchFood);
    searchInput.addEventListener("keypress", e => {
        if(e.key === "Enter") searchFood();
    });
}