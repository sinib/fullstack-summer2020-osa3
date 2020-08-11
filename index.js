const express = require('express')
const morgan = require('morgan')

morgan.token('body', (req, res) => {
    if(JSON.stringify(req.body) != '{}'){
        return JSON.stringify(req.body)
    }
    return null
  }
)

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

const generateId = () => {
    return Math.floor(Math.random()*1000)
}
 
app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})

app.get('/info', (req, res) => {
    const date = Date()
    const contactCount = persons.length
    res.send(`<p>Phonebook has ${contactCount} contacts.</p>
            <p>${date}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const guy = persons.find(person => person.id === id)
    if (guy) {    
        res.json(guy)  
    } 
    else {    
        res.status(404).end()  
    }
})

app.post('/api/persons', (req, res) => {
    const newGuyData = req.body

    if (!newGuyData.name || !newGuyData.number) {
        return res.status(400)
            .json(
                { 
                error: 'Name or number is missing!' 
                }
            )
    }

    else if(!persons.every(person => person.name != newGuyData.name)){
        return res.status(400)
            .json(
                { 
                error: 'This name is already in the contacts!' 
                }
            )
    }

    const newGuy = {
        name: newGuyData.name,
        number: newGuyData.number,
        id: generateId(),
    }

    persons = persons.concat(newGuy)
  
    res.json(newGuy)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})