const express = require("express");

const router = express.Router();

const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors");

  res.render("create-post", { authors: authors });
});

// Create Post
router.post("/posts", async function (req, res) {
  // fetching data from name propery at HTML template
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  // (?) means placeholder that will hold the data from the body and will output and array
  // [data] at the second parameter will hold all of that data and will fill in the (?) placeholder
  await db.query(
    "INSERT INTO posts (title, summary, body, author_id) VALUES (?)",
    [data]
  );

  res.redirect("/posts");
});

// Read Posts
router.get("/posts", async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS author_name FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

// Get Specific Post
router.get("/posts/:id", async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
  `;

  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(404).render("404");
  }

  // change the date time to human-readable
  const postData = {
    // using spread operator
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString("en-US", {
      day: "numeric",
      weekday: "long",
      month: "long",
      year: "numeric",
    }),
  };

  res.render("post-detail", { post: postData });
});

// Update Post
router.get("/posts/:id/edit", async function (req, res) {
  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    return res.status(400).render("400");
  }

  res.render("update-post", { post: posts[0] });
});

module.exports = router;
