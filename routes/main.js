const app = require("../index");
const bcrypt = require("bcrypt");

module.exports = function (app) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", { user: req.session.user });
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs");
  });

  app.post("/login", async function (req, res) {
    const { email, password } = req.body;

    try {
      const results = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (passwordMatch) {
          req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          return res.redirect("/");
        } else {
          return res.render("login.ejs", {
            message: "Invalid email or password. Please try again.",
          });
        }
      } else {
        return res.render("login.ejs", {
          message: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
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

  app.get("/applyforjobs", function (req, res) {
    res.render("applyforjobs.ejs");
  });

  app.get("/postajob", function (req, res) {
    res.render("postajob.ejs");
  });

  app.get("/C.V", function (req, res) {
    res.render("c.v.ejs");
  });

  app.get("/mentoring", function (req, res) {
    res.render("mentoring.ejs");
  });

  app.get("/training", function (req, res) {
    res.render("training.ejs");
  });
};
