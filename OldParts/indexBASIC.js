/*
Line under this comment is us importing Node's built-in web server module,
which is similar to our browser-side code: import http from 'http'
*/
const http = require('http')


/*
createServer creates a new web server. 

An event handler is registered to the server that is called every time an 
HTTP request is made to the server's address http://localhost:3001.
The request is responded to with the status code 200, with the Content-Type 
header set to text/plain, and the content of the site to be returned set to Hello World.
*/
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

/*
These 3 lines bind the http server assigned to the app variable, 
to listen to HTTP requests sent to port 3001
*/
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)