require('dotenv').config();
const { response } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// use morgan middleware to log requests
morgan.token('body', (req, res) => JSON.stringify(req.body)); // custom token for body
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
  .catch(error => next(error));
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`);
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
      if(person) res.json(person);
      else res.status(404).end;
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end();
      })
});

const generateId = () => {
    return Math.random() * 15000;
}

app.post('/api/persons', (req,res) => {
    const body = req.body
  
    const person = new Person({
      name: body.name,
      number: body.number,
    });
  
    person.save().then(savedPerson => {
      res.json(savedPerson);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body);
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});