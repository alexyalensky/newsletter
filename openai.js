const express = require ("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function (req,res) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
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

    const jsonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/39e74ee619";

    const options = {
        method: "POST",
        auth: "alex:bf2177efe60609eb0469acbda6e028ec-us21",
        // headers: {
        //     "Content-Type": "application/json"
        // }
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(data);
            res.send("Successfully subscribed");
        })
    });
    
    request.write(jsonData);
    request.end();
    request.on("error", (error) => {
        console.error(error);
        res.send("Failed to subscribe");
    });
});

app.listen ("5000", function(req,res) {
    console.log("The server is running on port 5000");
})
