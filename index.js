/*
we're importing express, which this time is a function that is used to create 
an Express application stored in the app variable
*/
const express = require('express')
const app = express()

// allow for requests from all origins
//const cors = require('cors')
//app.use(cors())

app.use(express.json())

app.use(express.static('dist'))


let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

/*
We then define two routes to the application.

The first one defines an event handler that is used to handle HTTP GET 
requests made to the application's / root.

The event handler function accepts two parameters. 
The first request parameter contains all of the information of the HTTP request, 
and the second response parameter is used to define how the request is responded to.

Since the parameter is a string, Express automatically sets the value of the 
Content-Type header to be text/html. The status code of the response defaults to 200.
*/


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})


/*
This second route defines an event handler that handles HTTP GET 
requests made to the notes path of the application.

The request is responded to with the json method of the response object. 
Calling the method will send the notes array that was passed to it as a JSON 
formatted string. Express automatically sets the Content-Type header with the 
appropriate value of application/json.

We also don't have to use stringify like when we were using Node since Express handles that for us.
*/
app.get('/api/notes', (request, response) => {
    response.json(notes)
})


/*
We can define parameters for routes in Express by using the colon syntax.
The id parameter in the route of a request can be accessed through the request object:
const id = request.params.id
*/
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    // If the note is not found, we can respond with a 404 status code
    // Also, all JavaScript objects evaluate to true in a comparison operation
    // However, undefined evaluates to false
    if (note) {
        response.json(note)
    } else {
        response.statusMessage = "Note not found"
        response.status(404).end()
    }
})

/*
If deleting the resource is successful, meaning that the note exists and is removed, 
we respond to the request with the status code 204 no content and return no data with the response.
*/
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

/*
Without the json-parser, the body property would be undefined. 
The json-parser takes the JSON data of a request, transforms it into a 
JavaScript object and then attaches it to the body property of the request 
object before the route handler is called.

This version does nothing except print in console
*/
// app.post('/api/notes', (request, response) => {
//     const note = request.body
//     console.log(note)
//     response.json(note)
// })


// Improved version, but this version doesn't require content and important property
// app.post('/api/notes', (request, response) => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => Number(n.id)))
//         : 0

//     const note = request.body
//     note.id = String(maxId + 1)

//     notes = notes.concat(note)

//     response.json(note)
// })

/*
notes.map(n => n.id) creates a new array that contains all the ids of the 
notes in number form. Math.max returns the maximum value of the numbers that 
are passed to it. However, notes.map(n => Number(n.id)) is an array so it 
can't directly be given as a parameter to Math.max. The array can be 
transformed into individual numbers by using the "three dot" spread syntax ... .
*/
const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})