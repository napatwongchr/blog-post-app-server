import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/posts", async (req, res) => {
  // ลอจิกในการเก็บข้อมูลของโพสต์ลงในฐานข้อมูล

  // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };

  // 2) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
  try {
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
  } catch {
    return res.status(500).json({
      message: "Server could not create post because database issue",
    });
  }

  // 3) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ

  return res.status(201).json({
    message: "Created post sucessfully",
  });
});

app.get("/posts", async (req, res) => {
  // ลอจิกในอ่านข้อมูลโพสต์ทั้งหมดในระบบ
  // 1) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
  let results;

  const category = req.query.category;
  const length = req.query.length;

  try {
    results = await connectionPool.query(
      `
      select * from posts 
      where 
          (category = $1 or $1 is null or $1 = '') 
          and 
          (length = $2 or $2 is null or $2 = '');
      `,
      [category, length]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database issue",
    });
  }

  // 2) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    data: results.rows,
  });
});

app.get("/posts/:postId", async (req, res) => {
  // ลอจิกในอ่านข้อมูลโพสต์ด้วย Id ในระบบ
  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const postIdFromClient = req.params.postId;

  // 2) เขียน Query เพื่ออ่านข้อมูลโพสต์ ด้วย Connection Pool
  const results = await connectionPool.query(
    `
		select * from posts where post_id=$1
	`,
    [postIdFromClient]
  );

  // เพิ่ม Conditional logic ว่าถ้าข้อมูลที่ได้กลับมาจากฐานข้อมูลเป็นค่า false (null / undefined)
  // ก็ให้ Return response ด้วย status code 404
  // พร้อมกับข้อความว่า "Server could not find a requested post (post id: x)"
  if (!results.rows[0]) {
    return res.status(404).json({
      message: `Server could not find a requested post (post id: ${postIdFromClient})`,
    });
  }

  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    data: results.rows[0],
  });
});

app.put("/posts/:postId", async (req, res) => {
  // ลอจิกในการแก้ไขข้อมูลโพสต์ด้วย Id ในระบบ

  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  // และข้อมูลโพสต์ที่ Client ส่งมาแก้ไขจาก Body ของ Request
  const postIdFromClient = req.params.postId;
  const updatedPost = { ...req.body, updated_at: new Date() };

  // 2) เขียน Query เพื่อแก้ไขข้อมูลโพสต์ ด้วย Connection Pool
  await connectionPool.query(
    `
      update posts
      set title = $2,
          content = $3,
          category = $4,
          length = $5,
          status = $6,
          updated_at = $7
      where post_id = $1
    `,
    [
      postIdFromClient,
      updatedPost.title,
      updatedPost.content,
      updatedPost.category,
      updatedPost.length,
      updatedPost.status,
      updatedPost.updated_at,
    ]
  );

  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    message: "Updated post sucessfully",
  });
});

app.delete("/posts/:postId", async (req, res) => {
  // ลอจิกในการลบข้อมูลโพสต์ด้วย Id ในระบบ
  // 1) Access ตัว Endpoint Parameter ด้วย req.params
  const postIdFromClient = req.params.postId;
  // 2) เขียน Query เพื่อลบข้อมูลโพสต์ ด้วย Connection Pool
  await connectionPool.query(
    `delete from posts
	   where post_id = $1`,
    [postIdFromClient]
  );
  // 3) Return ตัว Response กลับไปหา Client
  return res.status(200).json({
    message: "Delete post sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
