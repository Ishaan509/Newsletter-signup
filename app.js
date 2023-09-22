const express=require("express");
const bodyParser= require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv=require("dotenv");
dotenv.config();
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});

//setting up mailchimp
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API,
    server: "us11",
  });

app.post("/",(req,res)=>{
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const Email=req.body.mail;

    //add a contact to an audience
    const listid = process.env.MAILCHIMP_LISTID;
    const subscribinguser = {
    firstname: firstName,
    lastname: lastName,
    email: Email
    };

    //uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listid, {
        email_address: subscribinguser.email,
        status: "subscribed",
        merge_fields: {
        FNAME: subscribinguser.firstname,
        LNAME: subscribinguser.lastname
        }
    });
    res.sendFile(__dirname+"/success.html");
    console.log(`successfully added contact as an audience member. the contact's id is ${response.id}.`);
    }
    run().catch((e) => {
        console.log(e.status);
        res.sendFile(__dirname+"/failure.html");
    });
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000");
});
