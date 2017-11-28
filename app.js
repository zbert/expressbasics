var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var db = {
  people: [
    {
      id: 1,
      name: 'rene'
    },
    {
      id: 2,
      name: 'riyan'
    },
    {
      id: 3,
      name: 'alexa'
    }
  ]
}

const getPersonById = (id) =>
  db.people
    .filter(({id: dbid}) => dbid === parseInt(id))[0]

const removePersonById = (id) => {
  db.people = db.people.filter((person) => person.id !== parseInt(id))
}

const deletePerson = (id) => {
  var deletedPersonData = getPersonById(id)

  if (deletedPersonData !== undefined) {
    removePersonById(id)
    return deletedPersonData
  } else {
    return {
      error: true,
      message: `Couldn't Find person with specified ID of ${id}`
    }
  }
}

const addPerson = (id, person) => db.people.push({
  id: id,
  name: person.name
})

const updatePersonWithId = (id, {name}) => {
  const person = getPersonById(id)

  if (person) {
    const updatedPerson = {
      id: person.id,
      name: name
    }

    removePersonById(id)

    addPerson(id, updatedPerson)

    return updatedPerson
  }
}

// middleware
app.use(bodyParser.json())

// routes
app.get('/people', (req, res) => {
  res.json(db.people)
})

app.get('/people/:id', (req, res) => {
  const id = req.params['id']

  const person = getPersonById(id)

  if (person === undefined) {
    res.json({
      error: true,
      message: `could not user with ${id}`
    })
  } else {
    res.json(person)
  }
})

app.post('/people', (req, res) => {
  var newid = db.people.length + 1

  addPerson(newid, req.body)

  res.json(getPersonById(db.people.length))
})

app.put('/people/:id', (req, res) => {
  const body = req.body
  const id = req.params.id
  const updatedPerson = updatePersonWithId(id, {name: body.name})

  if (updatedPerson) {
    res.json(updatedPerson)
  } else {
    res.json({
      error: true,
      message: `could not find person with ${id}`
    })
  }
})

app.delete('/people/:id', (req, res) => {
  const id = req.params.id

  var deletedPerson = deletePerson(id)

  res.json(deletedPerson)
})

app.listen(3000, () => {
  console.log('kljslkj')
})