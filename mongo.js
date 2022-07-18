const mongoose = require('mongoose')

if (process.argv.length === 3) {
    const password = process.argv[2]

    const url = `mongodb+srv://willd20:${password}@cluster0.tnx7z.mongodb.net/phonebook?retryWrites=true&w=majority`

    const personSchema = new mongoose.Schema({
    name: String,
    number: String
    })

    const Person = mongoose.model('Person', personSchema)

    mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')
  
      Person.find({}).then(persons => {
          persons.forEach(person => {
            console.log(person)
          })
          mongoose.connection.close()
        })

        return person.save();
    })
    .then(() => {
      console.log('note saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

}
else if (process.argv.length === 5) {
    const password = process.argv[2]
    const name = process.argv[3];
    const number = process.argv[4];

    const url = `mongodb+srv://willd20:${password}@cluster0.tnx7z.mongodb.net/phonebook?retryWrites=true&w=majority`

    const personSchema = new mongoose.Schema({
    name: String,
    number: String
    })

    const Person = mongoose.model('Person', personSchema)

    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        const person = new Person({
        name: name,
        number: number
        })

        return person.save()
    })
    .then(() => {
        console.log(`added ${name} with number ${number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
