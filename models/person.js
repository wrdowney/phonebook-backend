const mongoose = require('mongoose');

const url = process.env.MONGODB_URI // defined in Heroku congfig vars

console.log('connecting to', url);


// establish connection to database
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message);
    });


// define general schema for person objects
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

// remove _id and __v from objects returned from the database
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema); // export module