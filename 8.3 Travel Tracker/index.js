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

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async(req, res)=>{
  try {
    const data = req.body.country;
    const country_name = data[0].toUpperCase() + data.substring(1);
    const code = await db.query("SELECT country_code FROM countries WHERE country_name = $1;", [country_name]);
    const add = await db.query("INSERT INTO visited_countries(country_code) values($1)", [code.rows[0].country_code]);
    console.log(code.rows[0].country_code);
    res.redirect('/')
    
  } catch (error) {
    console.log(error)
    
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
