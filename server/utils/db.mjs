import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:H3bNtLZXzveCUBTk2kEe@localhost:5432/my-blog-app",
});

export default connectionPool;
