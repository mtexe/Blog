//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

// required to access the Weather API
const https = require("https");

const homeStartingContent = "Introductory content for my blog. This is the starting page for my daily journal.";
const aboutContent = "This page describes what the blog is all about and some information about myself.";
const contactContent = "Brief information about how to contact me via social media.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
//This EJS view will input a city name from user
// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity
// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display
// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - temperature in F, description and humidity

// Author of code below : YashaR - great work! 
//posting the weather inputs

//global array for weathers and inputs will be pushed in here
let weathers = [];

//getting the weather page
app.get("/weather", function(req,res){
  res.render("weather", {
    weathers:weathers
  });
});

app.post("/weather", function(req,res){
//weathers array will be cleared everytime a post is made
weathers = [];
      const city = req.body.city;
      const units = "imperial";
      const apiKey = "67f6b382921c1e89b39b20d4f9556f22"; //DebasisB API Key
      const url = "https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&q=" +city+ "&units=" + units;
      console.log(city);

      https.get(url, function(response){

          // gets individual items from Open Weather API
          response.on("data", function(data){
              const weatherData = JSON.parse(data);
              const temp = weatherData.main.temp;
              const city = weatherData.name;
              const humidity = weatherData.main.humidity;
              const weatherDescription = weatherData.weather[0].description;
              const icon = weatherData.weather[0].icon;
              const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            //object that will be pushed back to weathers array and to weather.ejs
              const weather = {
                city: city,
                image: imageURL,
                temp: Math.round(temp),
                weatherDescription: weatherDescription,
                humidity: humidity
              };
              weathers.push(weather);
              res.redirect("/weather");

          });

});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
