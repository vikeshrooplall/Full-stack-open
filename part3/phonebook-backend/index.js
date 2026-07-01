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
  // Get count from database
  Person.countDocuments({}).then(count => {
    response.send(`
      <P>Phonebook has info for ${personCount} people</p>
      <p>${currentTime.toString()}
    `)
  })
})

// get single person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found'})
      }
    })
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => Number(n.id)))
//     : 0
//     return String(maxId + 1)
// }

// post new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing"
    })
  }

  // Check for duplicate name in database
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: "The name already exists in the phonebook"
        })
      }

      // Create new person
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
