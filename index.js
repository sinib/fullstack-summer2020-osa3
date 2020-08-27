require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => {
    if(JSON.stringify(req.body) != '{}'){
        return JSON.stringify(req.body)
    }
    return null
  }
)

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
 
app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})

app.get('/info', (req, res) => {
    const date = Date()
    Person.countDocuments({},(aa,amount) => {
        res.send(`<p>Phonebook has ${amount} contacts.</p>
                <p>${date}</p>`
        )
    })
    
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then(guys => {
        res.json(guys)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(guy => {
        if (guy) {        
          res.json(guy)      
        } 
        else {        
            res.status(404).end()      
        }    
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const newGuyData = req.body
    if (!newGuyData.name || !newGuyData.number) {
        return res.status(400)
            .json(
                { 
                error: 'Name or number is missing!' 
                }
            )
    }
    const guy = new Person({
        name: newGuyData.name,
        number: newGuyData.number,
    })

    guy.save()
    .then(newGuy => {
        res.json(newGuy)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const newGuyData = req.body
    const guy = {
        name: newGuyData.name,
        number: newGuyData.number,
    }
    Person.findByIdAndUpdate(req.params.id, guy, { new: true })
    .then(newNumber => {
      res.json(newNumber)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'Id not valid' })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})