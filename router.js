const express = require("express");

const router = express.Router();
const { createFile, getFiles, getInfo } = require("./files");

router.post("/", createFile);

router.get("/", getFiles);

router.get("/:filename", getInfo);

module.exports = router;
