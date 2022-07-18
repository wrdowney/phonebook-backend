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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
      res.json(person);
    });
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end();
      })
      .catch(error => next(error))
});

const generateId = () => {
    return Math.random() * 15000;
}

app.post('/api/persons', (req,res) => {
    const body = req.body
    
    // check if data is empty
    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'name or number is missing' 
      });
    }

    if(persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    });
  
    persons = persons.concat(person)
  
    person.save().then(savedPerson => {
      res.json(savedPerson);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});