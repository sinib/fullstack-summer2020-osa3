const mongoose = require('mongoose')

const url = process.env.MONGODB_URI


console.log('Connecting to database', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {    
        console.log('Connection successful.')  
    })  
    .catch((error) => {    
        console.log('Database connection error:', error.message)  
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)