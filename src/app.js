const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { response, request } = require("express");
const geoCode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

console.log(__dirname);

const app = express();
const port = process.env.PORT || 3000;

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handle bars engine and views location
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

//setup staric directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Adrian Batuto",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Adrian Batuto",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Adrian Batuto",
    message: "This is a help message",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Your must provide an address",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // console.log(req.query.address);
  // res.send({
  //   forecast: "It's always sunny",
  //   location: "Philadelphia",
  //   address: geoCode(req.query.address),
  // });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Adrian Batuto",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Adrian Batuto",
    errorMessage: "Page not found",
  });
});
//app.com
//app.com/help
//app.com/about
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
