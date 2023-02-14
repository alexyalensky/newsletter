const express = require("express"); //defining the express routes 
const app = express(); // initialize express to a variable -> app 
const https = require("https"); // defining the usage of https for requests
const bodyParser = require("body-parser"); // defining the parser to parse data

app.use(express.static("public")); // defining the usage of static pages inside the application
app.use(bodyParser.urlencoded({ extended: true })); // defining the encoding of the parser

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//use the app express variable to "listen" when you are connecting to the root of the app. On the callback -> deliver the file

app.post("/", function (req, res) {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

// use the app express variable to listen to a post action for the / root. define the variables from the body according to the names to be assigned to variables  

  // console.log(email, firstName, lastName);

  const data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
// Build an object with params and values.


  const jsonData = JSON.stringify(data);
// "flaten" the object to be sent in a JSON

  const url = "https://us21.api.mailchimp.com/3.0/lists/39e74ee619";


  const options = {
    method: "POST",
    auth: "alex:aaabf2177efe60609eb0469acbda6e028ec-us21",
  }

  // define some params to be passed in the request.

  const request = https.request(url, options, function(response) {
// create an https request and pass params according to the request method.
    if (response.statusCode===200) {
      res.send("Successfully subscribed");
    } 
    else {
      res.sendFile(__dirname + '/failure.html')
    }
 // check the response status code for sucess or failure and deliver files relevabt file

    response.on("data", function (data) {
      const parsedData = JSON.parse(data);
      // listen to a response and get the actual data. Parse the json data to a variable.
    })
  });

  
  request.write(jsonData); // write to a buffer
  request.end(); // end the request inside a request and the entire post
  
});


app.post("/failure", function (req,res) {
  res.redirect("/"); // listen to a post from the failure page and redirect to root which is being listened by the get "/"
})


app.listen("5000", function (req, res) {
  console.log("The server is running on port 5000");
}); //initializes the express app listening on a specific port
