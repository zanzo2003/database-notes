import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  host: "localhost",
  port: 5432,
  password: "redapples",
  user: "postgres",
  database: "world"
})

db.connect();

let visited_countries = [];
let total = 0;

db.query("SELECT country_code FROM visited_countries", (err, res) => {
  if (err) {
    console.log('error in query execution'.err);
  } else {
    total = res.rowCount;
    visited_countries = res.rows;
    console.log(res.rows);
  }
})

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
