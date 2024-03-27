import express from "express";

const app = express();
const port = 4000;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/posts", (req, res) => {
  // ลอจิกในการเก็บข้อมูลของโพสต์ลงในฐานข้อมูล

  // 1) Access ข้อมูลใน Body จาก Request ด้วย req.body
  // 2) เขียน Query เพื่อ Insert ข้อมูลโพสต์ ด้วย Connection Pool
  // 3) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ

  return res.status(201).json({
    message: "Created post sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
