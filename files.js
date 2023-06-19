const fs = require("fs/promises");
const path = require("path");

const dataValidator = require("./helpers/dataValidator.js");
const checkExtension = require("./helpers/checkExtension.js");

async function createFile(req, res, next) {
  const { content, filename } = req.body;

  const { error } = dataValidator(req.body);

  if (error) {
    res.status(400).json({
      message: `please specify parameter ${error.details[0].path[0]}`,
    });

    return;
  }

  const { extension, result } = checkExtension(filename);

  if (!result) {
    res.status(400).json({
      message: `Sorry, application doesn't support files with ${extension} extension`,
    });
    return;
  }
  try {
    fs.writeFile(path.join(__dirname, "./files", filename), content, "utf-8");
    res.json({
      message: "File was created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function getFiles(req, res, next) {
  try {
    const result = await fs.readdir(path.join(__dirname, "./files"));
    if (result.length === 0) {
      res.status(404).json({
        message: "No files in this directory",
      });
      return;
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getInfo(req, res, next) {
  try {
    const { filename } = req.params;

    const folder = await fs.readdir(path.join(__dirname, "./files"));
    const result = folder.includes(filename);
    if (!result) {
      res.status(404).json({
        message: `No file with ${filename} found`,
      });
      return;
    }

    const info = await fs.readFile(
      path.join(__dirname, "./files/", filename),
      "utf-8"
    );

    const extension = path.extname(path.join(__dirname, "./files/", filename));
    const name = path.basename(
      path.join(__dirname, "./files/", filename),
      extension
    );

    const stat = await fs.stat(path.join(__dirname, "./files/", filename));

    res.json({
      name,
      extension: extension.slice(1),
      content: info,
      dateOfCreate: stat.birthtime.toString(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
module.exports = {
  createFile,
  getFiles,
  getInfo,
};
