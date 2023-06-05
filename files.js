const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const dataValidator = require("./helpers/dataValidator.js");
const checkExtension = require("./helpers/checkExtension.js");

async function createFile(filename, content) {
  const file = { content, filename };
  const { error } = dataValidator(file);

  if (error) {
    console.log(
      chalk.red(`please specify parameter ${error.details[0].path[0]}`)
    );
    return;
  }

  const { extension, result } = checkExtension(filename);

  if (!result) {
    console.log(
      chalk.red(
        `Sorry, application doesn't support files with ${extension} extension`
      )
    );
    return;
  }
  try {
    await fs.writeFile(
      path.join(__dirname, "./files", filename),
      content,
      "utf-8"
    );
    console.log(chalk.blue("File was created successfully!"));
  } catch (error) {
    console.log(error.message);
  }
}

async function getFiles() {
  try {
    const result = await fs.readdir(path.join(__dirname, "./files"));
    if (result.length === 0) {
      console.log(chalk.red("No files in this directory"));
      return;
    } else {
      return result;
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function getInfo(filename) {
  const folder = await fs.readdir(path.join(__dirname, "./files"));
  const result = folder.includes(filename);
  if (!result) {
    console.log(chalk.red(`No file with ${filename} found`));
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

  console.log({
    name,
    extension: extension.slice(1),
    content: info,
    dateOfCreate: stat.birthtime.toString(),
  });
}
module.exports = {
  createFile,
  getFiles,
  getInfo,
};
