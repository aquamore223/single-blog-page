const express = require("express");
const cors = require("cors");
const PocketBase = require('pocketbase').default;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize PocketBase connection to your remote URL
const pb = new PocketBase('https://itrain.services.hodessy.com');

console.log("📡 Connecting to PocketBase...");

// Test PocketBase connection (no auth required for public collections)
app.get("/api/test-pb", async (req, res) => {
    try {
        // Simple health check - doesn't require auth
        const health = await pb.health.check();
        res.json({ 
            success: true, 
            message: "✅ Connected to PocketBase!",
            health: health
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "❌ Failed to connect to PocketBase",
            error: error.message 
        });
    }
});

// GET all blog posts from your famousblog collection (public)
app.get("/api/posts", async (req, res) => {
    try {
        // Fetch posts from your 'famousblog' collection
        // This works if your collection has public read access
        const records = await pb.collection('famousblog').getList(1, 50, {
            sort: '-created', // Sort by newest first
        });
        
        res.json({
            success: true,
            posts: records.items,
            total: records.totalItems
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET a single blog post by ID (public)
app.get("/api/posts/:id", async (req, res) => {
    try {
        const record = await pb.collection('famousblog').getOne(req.params.id);
        
        res.json({
            success: true,
            post: record
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: "Post not found"
        });
    }
});

// CREATE a new blog post (no auth for now - we'll add later)
app.post("/api/posts", async (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        // Basic validation
        if (!title || !content || !author) {
            return res.status(400).json({
                success: false,
                error: "Title, content, and author are required"
            });
        }
        
        const data = {
            title,
            content,
            author
            // Don't include 'published' field if it doesn't exist in your collection
        };
        
        const record = await pb.collection('famousblog').create(data);
        
        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post: record
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// UPDATE a blog post
app.patch("/api/posts/:id", async (req, res) => {
    try {
        const record = await pb.collection('famousblog').update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: "Post updated successfully!",
            post: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE a blog post
app.delete("/api/posts/:id", async (req, res) => {
    try {
        await pb.collection('famousblog').delete(req.params.id);
        
        res.json({
            success: true,
            message: "Post deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Root route
app.get("/", (req, res) => {
    res.send(`
        <h1>📝 Famous Blog API Server</h1>
        <p>Your <strong>famousblog</strong> collection is ready (no authentication required).</p>
        <h3>Available endpoints:</h3>
        <ul>
            <li><a href="/api/test-pb">/api/test-pb</a> - Test PocketBase connection</li>
            <li><a href="/api/posts">/api/posts</a> - Get all blog posts</li>
            <li>/api/posts/:id - Get a single post</li>
            <li>POST /api/posts - Create a new post</li>
            <li>PATCH /api/posts/:id - Update a post</li>
            <li>DELETE /api/posts/:id - Delete a post</li>
        </ul>
        <p>📌 Try <a href="/api/posts">/api/posts</a> to see your blog posts!</p>
    `);
});

// Keep your food routes if you still need them
let foods = [];

app.post("/foods", (req, res) => {
    const food = req.body;
    foods.push(food);
    res.send("Food added successfully!");
});

app.get("/foods", (req, res) => {
    res.json(foods);
});

// Start server
app.listen(3000, () => {
    console.log("=================================");
    console.log("🚀 Server running on http://localhost:3000");
    console.log("📁 Collection: famousblog");
    console.log("🔓 Authentication: DISABLED (public access)");
    console.log("=================================");
    console.log("📍 Test connection: http://localhost:3000/api/test-pb");
    console.log("📍 View posts: http://localhost:3000/api/posts");
    console.log("=================================");
});