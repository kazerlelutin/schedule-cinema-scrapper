require("dotenv").config();

const express = require("express"),
  puppeteer = require("puppeteer"),
  app = express(),
  port = process.env.PORT;

app.get("/schedule/:movie/:localization", async (req, res) => {
  const { movie, localization } = req.params,
    browser = await puppeteer.launch({ args: ["--no-sandbox"] }),
    page = await browser.newPage();
  await page.goto(
    `https://www.google.com/search?q=s%C3%A9ance+cin%C3%A9ma+${movie}+${localization}`
  );

  await page.click("#L2AGLb");

  const show = await page.evaluate(() => {
    const showtimes = document.querySelector(`[data-date]`);

    if (showtimes) {
      const parser = [];
      showtimes.querySelectorAll("div").forEach((salle) => {
        const divs = salle.querySelectorAll("div"),
          show = { title: "", schedule: [] },
          title = salle.querySelector("a");
        if (title) {
          show.title = title.innerText;
        }
        divs.forEach((el) => {
          const txt = el.querySelector('[role="button"]');
          if (txt) {
            show.schedule.push({
              type: txt.getAttribute("data-st"),
              time: txt.querySelector("div").innerText,
            });
            parser.push(show);
          }
        });
      });
      return parser.filter((o) => o.title !== "");
    } else {
      return [];
    }
  });
  await browser.close();
  res.json({ show });
});

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
