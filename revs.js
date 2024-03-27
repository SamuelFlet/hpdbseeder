const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const random = require("getrandomjs");
const randomAnimalName = require("random-animal-name");

const csvWriter = createCsvWriter({
  header: ["TITLE", "CONTENT", "RATING","POSTEDBYID","PRODUCTID"],
  path: "revsfile.csv",
});

let titles = [];
for (let i = 0; i < 24; i++) {
  titles.push("TEST REVIEW " + randomAnimalName());
}
const revs = [3, 4, 5];
const content = "TEST REVIEW WITH RANDOM RATING";
const records = [];
titles.forEach((e) => {
  records.push([
    e,
    content,
    random(revs),
    1,
    Math.floor(Math.random() * (48 - 25 + 1) + 25),
  ]);
});

csvWriter
  .writeRecords(records) // returns a promise
  .then(() => {
    console.log("...Done");
  });