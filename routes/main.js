const app = require("../index");
const bcrypt = require("bcrypt");
const dynamicResume = require('../dynamic-resume');
const pdf = require('html-pdf');

const options = {
  "height": "10.5in",        // allowed units: mm, cm, in, px
  "width": "8in",        // allowed units: mm, cm, in, pxI
};

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

  app.get("/jobs", authenticateUser, function (req, res) {

    const query = "SELECT * FROM jobs";
    db.query(query, (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length > 0) {

        const jobs = results;
        res.render("jobs.ejs", {jobs: jobs});

      } else {

        res.render("jobs.ejs", {
          message: "Unable to find jobs!",
        });

      }
    });

  });

  app.get("/jobs/:j_id", authenticateUser, function (req, res) {
    const jobId = req.params.j_id;
    const query = "SELECT * FROM jobs where j_id = ?";
    db.query(query, [jobId], (error, results) => {
      if (error) {
        throw error;
      }

      if (results.length > 0) {

        const job = results[0];
        res.render("jobdetail.ejs", {job: job});

      } else {

        res.render("jobdetail.ejs", {
          message: "Unable to find jobs!",
        });
        
      }
    });

  });

  app.get("/postajob", authenticateUser, function (req, res) {
    res.render("postajob.ejs");
  });

  app.post("/postajob", authenticateUser, function (req, res) {
    const {
      j_cname,
      j_email,
      j_title,
      j_description,
      j_appdeadline,
    } = req.body;

    const query =
      "INSERT INTO jobs (j_cname, j_email, j_title, j_description, j_appdeadline, j_u_id) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [
      j_cname,
      j_email,
      j_title,
      j_description,
      j_appdeadline,
      req.session.user.id
    ];
    db.query(query, values, (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect("jobs.ejs")
    });
  });

  app.get("/C.V", authenticateUser, function (req, res) {
    res.render("c.v.ejs");
  });

  app.get('/cv-builder/:theme', authenticateUser, (req, res, next) => {
    console.log("theme: ", req.params.theme);
    switch (req.params.theme) {
        case '1':
            res.render('cv-builder.ejs', { theme: "blue" });
            break;
        case '2':
            res.render('cv-builder.ejs', { theme: "green" });
            break;
        default:
            res.render('cv-builder.ejs', { theme: "green" });
            break;
    }
});

app.post('/cv-builder', authenticateUser, (req, res, next) => {
  console.log(req.body.theme);
  // LOWERCASE -> REMOVE SPACE -> SHORT NAME 
  const userName = req.body.name;
  const lowercaseName = userName.toLowerCase();
  const noSpaceName = lowercaseName.replace(' ', '');
  const shortName = noSpaceName.slice(0, 10);

  //Educational Info
  const { degrees, universities, startYears, endYears } = req.body;
  const educationalInfo = [];

  for (let i = 0; i < degrees.length; i++) {
    const eduInfo = {
      degree: degrees[i],
      university: universities[i],
      startYear: startYears[i],
      endYear: endYears[i]
    };
    educationalInfo.push(eduInfo);
  }

  req.body.educationalInformation = educationalInfo;
  console.log(req.body);


  let themeOptions = {
      leftTextColor: "rgb(91, 88, 255)",
      leftBackgroundColor: 'rgb(12, 36, 58)',
      wholeBodyColor: ' rgb(250, 250, 250)',
      rightTextColor: 'rgb(12, 36, 58)'
  };

  if (req.body.theme === 'blue') {

      // HTML TO PDF CONVERTING
      pdf.create(dynamicResume(req.body, themeOptions), options).toFile(__dirname + "/docs/" + shortName + "-resume.pdf", (error, response) => {
          if (error) throw Error("File is not created");
          console.log(response.filename);
          res.sendFile(response.filename);
      });
  } else if (req.body.theme === 'green') {
      themeOptions = {
          leftTextColor: "rgb(183, 217, 255)",
          leftBackgroundColor: 'rgb(0, 119, 89)',
          wholeBodyColor: ' rgb(rgb(139, 247, 205))',
          rightTextColor: 'rgb(0, 119, 89)'
      };

      // HTML TO PDF CONVERTING
      pdf.create(dynamicResume(req.body, themeOptions), options).toFile(__dirname + "/docs/" + shortName + "-resume.pdf", (error, response) => {
        if (error) {
          console.log(error)
          throw Error("File is not created");
        }
          console.log(response.filename);
          res.sendFile(response.filename);
      });
  } else {
      // SETTING DEFAULT VALUE
      // HTML TO PDF CONVERTING
      pdf.create(dynamicResume(req.body, themeOptions), options).toFile(__dirname + "/docs/" + shortName + "-resume.pdf", (error, response) => {
          if (error) {
            console.log(error)
            throw Error("File is not created");
          }
          console.log(response.filename);
          res.sendFile(response.filename);
      });
  }


});

  app.get("/mentoring", authenticateUser, function (req, res) {
    res.render("mentoring.ejs");
  });

  app.get("/training", authenticateUser, function (req, res) {
    res.render("training.ejs");
  });
};
