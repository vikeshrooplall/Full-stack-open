require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

// Morgan logging
morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// get all persons from DB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get count from database
app.get('/info', (request, response) => {
  const currentTime = new Date()
  Person.countDocuments({}).then(count => {
    response.send(`
      <P>Phonebook has info for ${count} people</p>
      <p>${currentTime.toString()}
    `)
  })
})

// get single person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// post new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  // Check for duplicate name in database
  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'The name already exists in the phonebook'
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
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
