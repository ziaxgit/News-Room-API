const fs = require("fs/promises");
const endpointJson = require("../endpoints.json");

function fetchEndPointFile() {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
}

module.exports = fetchEndPointFile;
