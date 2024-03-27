const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const random = require("getrandomjs");
const randomAnimalName = require("random-animal-name");

const csvWriter = createCsvWriter({
  header: ["TITLE", "DESCRIPTION", "CONDITION", "COST", "PHOTO", "POSTEDBYID","PRODUCTID"],
  path: "listfile.csv",
});

let titles = [];
for (let i = 0; i < 24; i++) {
  titles.push("TEST LISTING " + randomAnimalName());
}

const conditions = ["like new", "good", "meh", "for parts"];

const description = "THIS IS A TEST LISTING";

const images = [
  "https://s3.tebi.io/hpdb/Listings/test1.png",
  "https://s3.tebi.io/hpdb/Listings/test2.png",
  "https://s3.tebi.io/hpdb/Listings/test3.png",
  "https://s3.tebi.io/hpdb/Listings/test4.png",
  "https://s3.tebi.io/hpdb/Listings/test5.png",
];

const records = [];

titles.forEach((e) => {
  records.push([
    e,
    description,
    random(conditions),
    Math.floor(Math.random() * 1000) + 0.99,
    random(images),
    1,
    Math.floor(Math.random() * (48 - 25 + 1) + 25),
  ]);
});

csvWriter
  .writeRecords(records) // returns a promise
  .then(() => {
    console.log("...Done");
  });
