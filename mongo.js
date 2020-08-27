const mongoose = require('mongoose')

const password = process.argv[2]
const url =
  `mongodb+srv://fullstacker:${password}@firstcluster.ziqnu.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const guy = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    guy.save().then(response => {
    console.log('Added ' + response.name +", number " + response.number + " to phonebook.")
    mongoose.connection.close()
    })

}

else{
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(guy => {
          console.log(guy.name + " " + guy.number)
        })
        mongoose.connection.close()
      })
}


