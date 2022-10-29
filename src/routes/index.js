const express = require("express");
const router = express.Router();

const authRecruiter = require("./auth.recruiter.route");
const authWorker = require('./auth.worker.route');
const experience = require('./experience.route');
const portfolio = require('./portfolio.route');
const worker = require('./worker.route');
const skills = require('./skill.router');

router
    .use("/auth/recruiters", authRecruiter)
    .use("/auth/workers", authWorker)
    .use("/experiences", experience)
    .use("/portofolio", portfolio)
    .use("/workers", worker)
    .use("/skills", skills)

module.exports = router