const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const fs = require("fs");

const csvWriter = createCsvWriter({
  header: ["NAME", "CATEGORY", "PHOTOURL", "RATING"],
  path: "file.csv",
});

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(
    "https://shenzhenaudio.com/collections/headphones?sort_by=best-selling&filter.v.price.gte=&filter.v.price.lte=&filter.p.m.custom.wearing_style=In-ear+Headphone",
    {
      waitUntil: "networkidle0",
    }
  );
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page);
  // get the text content of all the `.options` elements:
  const options = await page.$$eval(
    "div.sf__pcard-content.text-left.relative > div > div.max-w-full.w-full > h3 > a",
    (options) => {
      return options.map((option) => option.innerHTML.trim());
    }
  );
  const options2 = await page.$$eval(
    "div.flex.justify-center.items-center > a > div.spc__main-img > responsive-image > img",
    (options2) => {
      return options2.map((option2) => option2.src);
    }
  );
  let options3 = [];
  const tws = /\W*(tws)\W*/g;
  const iem = /\W*(in-ear headphone)\W*/g;
  await options.forEach((e) => {
    if ((e.toLowerCase().includes("tws"))) {
      options3.push("TWS");
    } else if ((e.toLowerCase().includes("in-ear headphone"))) {
      options3.push("IEM");
    }
  });
  const options4 = await page.$$eval(
    "div.sf__pcard-content.text-left.relative > div > div.max-w-full.w-full > div.sf-pcard__reviews > div",
    (options4) => {
      return options4.map((option4) => option4.getAttribute("data-rate"));
    }
  );
  const records = []
  await options.forEach((e,i)=>{
    records.push([e, options3[i], options2[i], options4[i]])
  })
  await csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log("...Done");
    });
  // Closes the browser and all of its pages
  await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
