const app = require("../index");
const bcrypt = require("bcrypt");

module.exports = function (app) {

  function authenticateUser(req, res, next) {
    if (req.session.user) {
      res.locals.user = req.session.user;
      return next();
    }
    res.redirect('/login');
  }

  // Handle our routes
  app.get("/", authenticateUser, function (req, res) {
    res.render("index.ejs")
    console.log("Auth User -->",req.session.user)
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs");
  });

  app.post("/login", function (req, res) {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (passwordMatch) {
          console.log("pass matached")
          req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.userType
          };
          res.redirect(`/`);
          
        } else {
          res.render("login.ejs", {
            message: "Invalid email or password. Please try again.",
          });
        }
      } else {
        res.render("login.ejs", {
          message: "Invalid email or password. Please try again.",
        });
      }
    });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
      res.redirect('/login');
    });
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });
  app.post("/register", function (req, res) {
    const {
      name,
      lastname,
      email,
      password,
      dob,
      userType,
      company,
      education,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query =
      "INSERT INTO users (name, lastname, email, password, dob, userType, company, education) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
      name,
      lastname,
      email,
      hashedPassword,
      dob,
      userType,
      company,
      education,
    ];
    db.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect("/login");
    });
  });

  app.get("/forgot", function (req, res) {
    res.render("forgot.ejs");
  });

  app.get("/applyforjobs", authenticateUser, function (req, res) {
    res.render("applyforjobs.ejs");
  });

  app.get("/postajob", authenticateUser, function (req, res) {
    res.render("postajob.ejs");
  });

  app.get("/C.V", authenticateUser, function (req, res) {
    res.render("c.v.ejs");
  });

  app.get("/mentoring", authenticateUser, function (req, res) {
    res.render("mentoring.ejs");
  });

  app.get("/training", authenticateUser, function (req, res) {
    res.render("training.ejs");
  });
};
