const pb = new PocketBase('https://itrain.services.hodessy.com');

const form = document.getElementById("adminForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("foodTitle").value,
    image: document.getElementById("foodImage").value,
    description: document.getElementById("foodDescription").value,
    ingredients: document.getElementById("foodIngredients").value.split(","),
    instructions: document.getElementById("foodInstructions").value.split(",")
  };

  console.log("Sending to PocketBase:", data); // 👈 DEBUG

  try {
    const record = await pb.collection('pbc_2106002237').create(data);
    
    console.log("SUCCESS:", record); // 👈 DEBUG
    alert("✅ Food added to database!");

  } catch (err) {
    console.error("ERROR:", err);
    alert("❌ Failed to add food");
  }
});