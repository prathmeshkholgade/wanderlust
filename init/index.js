let initData = require("../init/data.js");
let mongoose = require("mongoose");
let Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"65e97156db52b604da0955c1"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized")
};
initDb()