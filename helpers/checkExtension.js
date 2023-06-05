function checkExtension(filename) {
  const EXTENSIONS = ["txt", "js", "json", "html", "css"];

  const fileSlice = filename.split(".");
  const extension = fileSlice[fileSlice.length - 1];
  const result = EXTENSIONS.includes(extension);

  return {
    extension,
    result,
  };
}
module.exports = checkExtension;
