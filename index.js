const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// --------------------
// Part (c): Middleware
// --------------------

// Logger Middleware
function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
}

// Request Timing Middleware
function timer(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`Request completed in ${duration} ms`);
    });

    next();
}

// Apply middleware globally
app.use(logger);
app.use(timer);

// --------------------
// Part (a): Routes
// --------------------

// Basic Route
app.get("/", (req, res) => {
    res.send("Welcome to ExpressJS Routing and Middleware Experiment");
});

// Route Parameter
app.get("/user/:id", (req, res) => {
    const id = req.params.id;
    res.send(`User ID: ${id}`);
});

// Query Parameters
app.get("/search", (req, res) => {
    const q = req.query.q;
    const limit = req.query.limit;

    res.send(`Searching for '${q}', limit ${limit}`);
});

// URL Building using req.originalUrl
app.get("/current-url", (req, res) => {
    res.send(`Current URL: ${req.originalUrl}`);
});

// Redirect Example
app.get("/home", (req, res) => {
    res.redirect("/");
 });

// --------------------
// Part (b): Books API
// --------------------

let books = [
    {
        id: 1,
        title: "The Hobbit",
        author: "Tolkien"
    },
    {
        id: 2,
        title: "Dune",
        author: "Herbert"
    }
];

let nextId = 3;

// GET all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST new book
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            message: "Title and author are required"
        });
    }

    const newBook = {
        id: nextId++,
        title: title,
        author: author
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(204).send();
});

// --------------------
// Route-specific Middleware
// --------------------

function checkApiKey(req, res, next) {
    if (req.headers["x-api-key"] === "12345") {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

// Protected route
app.get("/protected", checkApiKey, (req, res) => {
    res.send("You are authorized to access this route");
});

// --------------------
// 404 Handler
// --------------------

app.use((req, res) => {
    res.status(404).send("Route Not Found");
});

// --------------------
// Start Server
// --------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
