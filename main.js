const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the session middleware
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 }, store: new FileStore() }));

const userData = {
  id: "hello",
  password: "1234",
};

// Access the session as req.session
app.get("/", function (req, res, next) {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});

app.get("/count", (req, res, next) => {
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num = req.session.num + 1;
  }
  res.send(`Views : ${req.session.num}`);
});

app.get("/login", (req, res, next) => {
  res.send(`
  <form action="/login_process" method="post" >
    <p>ID : <input type="text" placeholder="id" name="id" /></p>
    <p>PW : <input type="password" placeholder="password" name="password" /></p>
    <p><input type="submit" value="login"/></p>
  </form>
  `);
});

app.post("/login_process", (req, res, next) => {
  const body = req.body;
  const id = body.id;
  const pwd = body.password;

  if (id === userData.id && pwd === userData.password) {
    res.send("Welcome");
  } else {
    res.send("Wrong!");
  }
});

app.listen(3000, () => console.log("listening port 3000"));
