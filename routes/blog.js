const express = require("express");

const router = express.Router();

const db = require("../data/database");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const query = `
    SELECT posts.*, authors.name AS author_name FROM posts
    INNER JOIN authors ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors");

  res.render("create-post", { authors: authors });
});

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

  res.render("post-detail", { post: posts[0] });
});

module.exports = router;
