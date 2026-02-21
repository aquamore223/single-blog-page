import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@latest/dist/pocketbase.es.mjs';

const pb = new PocketBase('https://itrain.services.hodessy.com');

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

loadBlogs();