const express = require("express");
const layoutejs = require("express-ejs-layouts");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const App = express();
const Host = 8000;

App.set("view engine", "ejs");
App.use(express.static(__dirname + "/public"));
App.use(layoutejs);

App.get("/", function (req, res) {
  const index = req.query.index;
  const cari = req.query.cari;

  if (cari != null) {
    axios
      .get("https://www.detik.com/search/searchall?query=" + cari)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        let datalist = [];

        $(".list-berita > article").each(function (index, element) {
          datalist.push({
            image: $(element).find(".box_thumb > span > img").attr("src"),
            judul: $(element).find(".box_text > h2").text().trim(),
            tanggal: $(element).find(".box_text > .date").text().trim(),
          });
        });
        res.render("index", {
          layout: "layouts/master",
          title: "Berita Scraping Website",
          index: 1,
          data: datalist,
        });
      })
      .catch((e) => {
        res.send(e["message"]);
      });
  } else {
    if (index == null || index == 1 || index == 0) {
      axios
        .get("https://news.detik.com/indeks")
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          let datalist = [];

          $(".list-content > article").each(function (index, element) {
            datalist.push({
              image: $(element)
                .find(".media__image > a > span > img")
                .attr("src"),
              judul: $(element).find(".media__text > h3").text().trim(),
              tanggal: $(element).find(".media__date > span").text().trim(),
            });
          });
          res.render("index", {
            layout: "layouts/master",
            title: "Berita Scraping Website",
            index: 1,
            data: datalist,
          });
        })
        .catch((e) => {
          res.send(e["message"]);
        });
    } else {
      axios
        .get("https://news.detik.com/indeks/" + index)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          let datalist = [];

          $(".list-content > article").each(function (index, element) {
            datalist.push({
              image: $(element)
                .find(".media__image > a > span > img")
                .attr("src"),
              judul: $(element).find(".media__text > h3").text().trim(),
              tanggal: $(element).find(".media__date > span").text().trim(),
            });
          });
          res.render("index", {
            layout: "layouts/master",
            title: "Berita Scraping Website",
            index: parseInt(index),
            data: datalist,
          });
        })
        .catch((e) => {
          res.send(e["message"]);
        });
    }
  }
});

App.use("/", function (req, res) {
  res.status(404);
  res.send("404 Not Found");
});

App.listen(Host, function () {
  console.log("Server Anda Berjalan Di http://localhost:8000");
});
