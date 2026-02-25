
import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@latest/dist/pocketbase.es.mjs';
const pb = new PocketBase('https://itrain.services.hodessy.com');

let currentPage = 1;
const perPage = 6;

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

async function loadBlogs(page = 1) {
    try {
        const result = await pb.collection('famousblog').getList(page, perPage);

        const container = document.getElementById("foodGrid");
        if (!container) return;

        let html = "";

        result.items.forEach(blog => {
            const imageUrl = blog.image || 'https://via.placeholder.com/300x200?text=No+Image';

            html += `
                <div class="category-card blog-card">
                    <div class="image-wrapper">
                        <img src="${imageUrl}" alt="${blog.title}"  loading="lazy">
                    </div>
                    <h3>${blog.title}</h3>
                    <p>${blog.description || ''}</p>
                    <a href="food-details.html?id=${blog.id}">
                        <button>View Details</button>
                    </a>
                </div>
            `;
        });

        container.innerHTML = html;

        // 🔥 Update pagination buttons
        renderPagination(result.page, result.totalPages);

    } catch (error) {
        console.error("Error loading blogs:", error);
    }
}

function renderPagination(current, total) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    let html = "";

    // Previous button
    if (current > 1) {
        html += `<button onclick="changePage(${current - 1})">Prev</button>`;
    }

    // Page numbers
    for (let i = 1; i <= total; i++) {
        html += `
            <button onclick="changePage(${i})"
                class="${i === current ? 'active-page' : ''}">
                ${i}
            </button>
        `;
    }

    // Next button
    if (current < total) {
        html += `<button onclick="changePage(${current + 1})">Next</button>`;
    }

    pagination.innerHTML = html;
}
  function changePage(page) {
    currentPage = page;
    loadBlogs(currentPage);
}

window.changePage = changePage;

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