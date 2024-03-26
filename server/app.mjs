import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/posts", async function (req, res) {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };

  await connectionPool.query(
    `insert into posts (user_id, title, content, category, length, created_at, updated_at, published_at, status)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      1, // นี่คือ user_id ที่ถูกจำลองขึ้นมา เนื่องจากเรายังไม่มีระบบ Authentication ในส่วน Back End
      newPost.title,
      newPost.content,
      newPost.category,
      newPost.length,
      newPost.created_at,
      newPost.updated_at,
      newPost.published_at,
      newPost.status,
    ]
  );

  return res.status(201).json({
    message: "Created post sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
