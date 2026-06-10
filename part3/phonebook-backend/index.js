require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const requestLogger = require('morgan')
const app = express()


app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(requestLogger(':method :url :status :res[content-length] - :response-time ms :body'))

// get all persons from DB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get Info - get count from database
app.get('/info', (request, response) => {
  const currentTime = new Date()
  const personCount = persons.length
  response.send(`
    <P>Phonebook has info for ${personCount} people</p>
    <p>${currentTime.toString()}
    `)
})

// get single person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  response.json(person)
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
    return String(maxId + 1)
}

// post new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    })
  }

  const duplicateName = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

  if (duplicateName) {
    return response.status(400).json({
      error: "The name already exists in the phonebook"
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
