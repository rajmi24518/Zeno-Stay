const express = require("express");
const app = express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req, res) => {
    res.send("Hi,I am root");
});

app.get("/listings",async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs",{allListings});
 }); 

 //New Route
 app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

 
// Show route
app.get("/listings/:id",async(req , res) => {
    let{id}=req.params;
    const listings = await Listing.findById(id);
    res.render("../views/listings/show.ejs",{listings})
});
 
//Create or add route
app.post("/listings", async (req , res) =>{
    const newListings=new Listing( req.body.listings);
    await newListings.save();
    res.redirect("/listings");
});
//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
   let{id}=req.params;
   const listings = await Listing.findById(id);
   res.render("listings/edit.ejs",{listings}); 
});

//Update Route
app.put("/listings/:id",async(req,res) =>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listings});
    res.redirect(`/listings/${id}` );
})
//Delete Route
app.delete("/listings/:id", async(req,res) =>{
    let{id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
} )

/*app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title:"My New Villa",
        description: "By the beach",
        price: 1200,
        location:"Calangute,Goa",
        contry:"India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("sucessful testing");
});*/

app.listen(8080,() => {
    console.log("server is listening to port 8080");

});