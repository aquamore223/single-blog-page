const pb = new PocketBase('https://itrain.services.hodessy.com');

const form = document.getElementById("adminForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("foodTitle").value,
    image: document.getElementById("foodImage").value,
    description: document.getElementById("foodDescription").value,
    ingredients: document.getElementById("foodIngredients").value,
    instructions: document.getElementById("foodInstructions").value,
    author: document.getElementById("foodAuthorInput").value,
  };

  console.log("Sending to PocketBase:", data); // 👈 DEBUG

  try {
    const record = await pb.collection('famousblog').create(data); 
    
    console.log("SUCCESS:", record); // 👈 DEBUG
    alert("✅ Food added to database!");

  } catch (err) {
    console.error("ERROR:", err);
    alert("❌ Failed to add food");
  }
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}