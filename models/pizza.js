const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Creating a schema for the piza with the following requirements
// The name of the pizza
// The name of the user that created the pizza
// A timestamp of when the pizza was created
// A timestamp of any updates to the pizza's data
// The pizza's suggested size
// The pizza's toppings
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Getter function
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: 'Large',
    },
    toppings: [],
    // Creating a realtionship b/w Pizza and Comment Model
    comments: [
      {
        type: Schema.Types.ObjectId, //tell Mongoose to expect an ObjectId
        ref: 'Comment',
      },
    ],
  },
  // Telling schema that it can use virtuals.
  {
    toJSON: {
      virtuals: true,
      // Telling moongose that getter function is used
      getters: true,
    },
    id: false, //this is a virtual that Mongoose returns and we dont't need it
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;
