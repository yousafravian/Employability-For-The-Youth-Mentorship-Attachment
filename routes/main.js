const bcrypt = require("bcrypt");
const dynamicResume = require("../dynamic-resume");
const pdf = require("html-pdf");
const multer = require("multer");
const fs = require("fs");
const {Console} = require("console");

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const options = {
    height: "10.5in", // allowed units: mm, cm, in, px
    width: "8in", // allowed units: mm, cm, in, pxI
};

const mongoose = require("mongoose");

// Importing models
const User = require("../models/Users");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const Mentoring = require("../models/Mentoring");
const Training = require("../models/Training");

module.exports = function (app) {
    function authenticateUser(req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user;
            return next();
        }
        res.status(401).json({message: "Unauthorized"});
    }

    // Function to check if a user has applied for a job
    async function hasAppliedForJob(userId, jobId) {
        try {
            const count = await JobApplication.countDocuments({
                ja_j_id: jobId,
                ja_u_id: userId,
            });
            return count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Function to count job applications
    async function countJobApplications(jobId) {
        try {
            const count = await JobApplication.countDocuments({ja_j_id: jobId});
            return count;
        } catch (error) {
            throw error;
        }
    }

    // Handle our routes
    app.get("/api", authenticateUser, function (req, res) {
        res.render("index.ejs");
    });

    app.get("/api/isAuthenticated", function (req, res) {
        try {
            if (req.session.user) {
                return res.status(200).json({isAuthenticated: true});
            }

            return res.status(401).json({isAuthenticated: false});
        } catch (e) {

            return res.status(401).json({isAuthenticated: false});
        }
    });

    /*app.get("/api/login", function (req, res) {
      res.render("login.ejs");
    });*/

    app.post("/api/login", async (req, res) => {
        const {email, password} = req.body;

        try {
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({
                    message: "Invalid email or password. Please try again.",
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    type: user.userType,
                };
                res.status(200).json({
                    message: "Login Successful",
                    user
                });
            } else {
                return res.status(401).json({
                    message: "Invalid email or password. Please try again.",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/api/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(400).send("Error logging out");
            }
            return res.status(200).json({message: "Logged out successfully"})
        });
    });

    /*app.get("/api/register", function (req, res) {
      res.render("register.ejs");
    });*/

    app.post("/api/register", async (req, res) => {
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
        const newUser = await User.create({
            name,
            lastname,
            email,
            password: hashedPassword,
            dob,
            userType,
            company,
            education,
        });

        if (!newUser) {
            return res.status(400).json({
                message: "Failed to register user",
            });
        }
        return res.status(200).json({message: "User registered", user: newUser});
    });

    /*app.get("/api/forgot", function (req, res) {
      res.render("forgot.ejs");
    });*/

    // /jobs route
    app.get("/api/jobs", authenticateUser, async function (req, res) {
        try {
            let query;
            if (req.session.user.type === "student") {
                query = {};
            } else if (req.session.user.type === "employer") {
                query = {j_u_id: req.session.user.id};
            }

            const jobs = await Job.find(query);

            return res.status(200).json({jobs});
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    // /jobs/:j_id route
    app.get("/api/jobs/:j_id", authenticateUser, async function (req, res) {
        const jobId = req.params.j_id;

        try {
            const job = await Job.findById(jobId);
            if (job) {
                if (req.session.user.type === "student") {
                    const applied = await hasAppliedForJob(req.session.user.id, jobId);
                    job['_doc'].already_applied = applied ? "yes" : "no";
                } else {
                    const count = await countJobApplications(jobId);
                    job['_doc'].jobApplicationsCount = count;
                }

                return res.status(200).json({job});
            } else {
                return res.status(404).json({message: "Job not found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    /*app.get("/api/applyforjob/:j_id", function (req, res) {
      const jobId = req.params.j_id;
      res.render("applyforjob.ejs", { j_id: jobId });
    });*/

    // applyforjob route
    app.post(
        "/api/applyforjob",
        authenticateUser,
        upload.single("file"),
        async function (req, res) {
            try {
                const {ja_message, ja_j_id} = req.body;

                const jobApplication = new JobApplication({
                    ja_j_id: ja_j_id,
                    ja_file: req.file.buffer,
                    ja_u_id: req.session.user.id,
                    ja_message: ja_message,
                });

                await jobApplication.save();

                res.status(200).json({message: "Submission Successful!"});
            } catch (error) {
                console.error(error);
                res.status(500).json({message: "Application Failed! Please try again."});
            }
        }
    );

   /* app.get("/api/postajob", authenticateUser, function (req, res) {
        res.render("postajob.ejs");
    });*/

    app.post("/api/postajob", authenticateUser, async function (req, res) {
        try {
            const {j_cname, j_email, j_title, j_description, j_appdeadline} =
                req.body;

            const job = new Job({
                j_cname,
                j_email,
                j_title,
                j_description,
                j_appdeadline,
                j_u_id: req.session.user.id,
                created_at: new Date(),
            });

            await job.save();

            res.status(200).json({message: "Job posted successfully!"});
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.get("/api/C.V", authenticateUser, function (req, res) {
        res.render("c.v.ejs");
    });

    /*app.get("/api/cv-builder/:theme", authenticateUser, (req, res, next) => {
        switch (req.params.theme) {
            case "1":
                res.render("cv-builder.ejs", {theme: "blue"});
                break;
            case "2":
                res.render("cv-builder.ejs", {theme: "green"});
                break;
            default:
                res.render("cv-builder.ejs", {theme: "green"});
                break;
        }
    });*/

    app.post("/api/cv-builder", authenticateUser, (req, res, next) => {
        // LOWERCASE -> REMOVE SPACE -> SHORT NAME
        const userName = req.body.name;
        const lowercaseName = userName.toLowerCase();
        const noSpaceName = lowercaseName.replace(" ", "");
        const shortName = noSpaceName.slice(0, 10);

        //Educational Info
        const {degrees, universities, startYears, endYears} = req.body;
        const educationalInfo = [];

        for (let i = 0; i < degrees.length; i++) {
            const eduInfo = {
                degree: degrees[i],
                university: universities[i],
                startYear: startYears[i],
                endYear: endYears[i],
            };
            educationalInfo.push(eduInfo);
        }

        req.body.educationalInformation = educationalInfo;

        let themeOptions = {
            leftTextColor: "rgb(91, 88, 255)",
            leftBackgroundColor: "rgb(12, 36, 58)",
            wholeBodyColor: " rgb(250, 250, 250)",
            rightTextColor: "rgb(12, 36, 58)",
        };

        if (req.body.theme === "blue") {
            // HTML TO PDF CONVERTING
            pdf
                .create(dynamicResume(req.body, themeOptions), options)
                .toFile(
                    __dirname + "/docs/" + shortName + "-resume.pdf",
                    (error, response) => {
                        if (error) throw Error("File is not created");
                        res.sendFile(response.filename);
                    }
                );
        } else if (req.body.theme === "green") {
            themeOptions = {
                leftTextColor: "rgb(183, 217, 255)",
                leftBackgroundColor: "rgb(0, 119, 89)",
                wholeBodyColor: " rgb(rgb(139, 247, 205))",
                rightTextColor: "rgb(0, 119, 89)",
            };

            // HTML TO PDF CONVERTING
            pdf
                .create(dynamicResume(req.body, themeOptions), options)
                .toFile(
                    __dirname + "/docs/" + shortName + "-resume.pdf",
                    (error, response) => {
                        if (error) {
                            console.log(error);
                            throw Error("File is not created");
                        }
                        res.sendFile(response.filename);
                    }
                );
        } else {
            // SETTING DEFAULT VALUE
            // HTML TO PDF CONVERTING
            pdf
                .create(dynamicResume(req.body, themeOptions), options)
                .toFile(
                    __dirname + "/docs/" + shortName + "-resume.pdf",
                    (error, response) => {
                        if (error) {
                            console.log(error);
                            throw Error("File is not created");
                        }
                        res.sendFile(response.filename);
                    }
                );
        }
    });

    /*app.get("/api/mentoring", authenticateUser, function (req, res) {
        res.render("mentoring.ejs");
    });*/

    // /mentoring route
    app.post(
        "/api/mentoring",
        authenticateUser,
        upload.single("file"),
        async function (req, res) {
            try {
                const {m_name, m_email, m_phone, m_enquiry} = req.body;

                const mentoringRequest = new Mentoring({
                    m_name,
                    m_email,
                    m_phone,
                    m_enquiry,
                    m_file: req.file.buffer,
                    m_u_id: req.session.user.id,
                });

                await mentoringRequest.save();

                return res.status(200).json({message: "Submission Successful!"});
            } catch (error) {
                console.error(error);
                return res.status(500).json({message: "Mentoring Request Failed! Please try again."});
            }
        }
    );

    // /viewmentoring route
    app.get("/api/viewmentoring", authenticateUser, async function (req, res) {
        try {
            const mentorings = await Mentoring.find();

            res.status(200).json({mentorings});
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Route to serve files
    app.get("/api/file/:id", async (req, res) => {
        const fileId = req.params.id;

        const mentoringAttachment = await Mentoring.findById(fileId);

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Attachment.pdf"`
        );

        // Set appropriate content type based on the file type
        res.setHeader("Content-Type", "application/pdf");

        // Send the blob data as the response
        res.send(mentoringAttachment.m_file);
    });

    app.get("/api/training", authenticateUser, function (req, res) {
        res.render("training.ejs");
    });

    // Route to submit skills
    app.post("/api/submitskills", authenticateUser, async (req, res) => {
        const {selectedSkills} = req.body;

        const training = await Training.create({
            t_u_id: req.session.user.id,
            t_trainings: JSON.stringify(selectedSkills),
        });

        if (!training) {
            return res.render("training.ejs", {
                error_message: "Submission Failed! Please try again.",
            });
        }

        res.render("training.ejs", {
            message: "Submission Successful!",
        });
    });
};
