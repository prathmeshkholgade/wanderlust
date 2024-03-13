const mongoose = require("mongoose");
const { type } = require("../utils/schema");
const Schema = mongoose.Schema;
let Review = require("./review");
const { object } = require("joi");

let listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url:String,
    filename:String
  },
  price: {
    type: Number,
    min: [1],
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "review" }],
  owner:{
    type:Schema.Types.ObjectId,ref:"User"
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id :{$in:listing.reviews}})
  }

})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
