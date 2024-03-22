const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

const connectionString =
  "postgresql://samuel:lE7JnRxBeZovnna3M-KhLA@carddb-6795.g8z.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full";

let stream = fs.createReadStream("listfile.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();

    // create a new connection to the database
    const pool = new Pool({
      connectionString,
    });

    const query =
      `INSERT INTO public."Listing" (TITLE,DESCRIPTION,CONDITION,COST,PHOTO,postedbyid,PRODUCTID) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach((row) => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);