const path = require("path");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//MiddleWare :

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // A week in milliseconds
app.get("/", (request, response) => {
  // This is just an example of setting a cookie
  let language = request.cookies.language;
  const name = request.cookies.name;

  const greetings = { english: "Hello", french: "Bonjour", spanish: "Hola" };

  let greeting;

  if (name && language) {
    language = language.trim();
    greeting = `${greetings[language]} , ${name}`;
  }

  response.render("home", { greeting });
});

// Routes

app.get("/prefered_language", (request, response) => {
  const selected = request.cookies.language;
  const name = request.cookies.name;
  const prefered_languages = {
    english: "english",
    french: "french",
    spanish: "spanish"
  };
  response.render("preferedLanguage", {
    selected,
    prefered_languages,
    name
  });
});

app.post("/prefered_language", (request, response) => {
  const params = request.body;
  response.cookie("name", params.name, { maxAge: COOKIE_MAX_AGE });
  response.cookie("language", params.language, { maxAge: COOKIE_MAX_AGE });
  response.redirect("/");
});

//Server
const PORT = 3000;
const ADDRESS = "localhost"; // 127.0.0.1
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listening on http://${ADDRESS}:${PORT}`);
});
