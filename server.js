const http = require('http')
const { todolist, headers } = require('./state.js')
const { errorHandle, successHandle } = require('./utils.js')
const { v4: uuidv4 } = require('uuid')
const requestListener = (req, res) => {
  let body = ''

  req.on('data', (data) => {
    body += data
  })

  if (req.url === '/todos' && req.method === 'GET') {
    successHandle(res)
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body)?.title
        if (title === undefined) throw Error('Not found title')

        const todo = {
          title: title,
          id: uuidv4(),
        }

        todolist.push(todo)

        successHandle(res)
      } catch (error) {
        errorHandle(res, error)
      }
    })
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body)?.title
        if (title === undefined) throw Error('Not found title')

        const id = req.url.split('/').pop()
        const targetIndex = todolist.findIndex((el) => el.id === id)

        if (targetIndex === -1) throw Error('Not found id')
        todolist[targetIndex].title = title

        successHandle(res)
      } catch (error) {
        errorHandle(res, error)
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todolist.length = 0
    successHandle(res)
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop()
        const targetIndex = todolist.findIndex((el) => el.id === id)

        if (targetIndex === -1) throw Error('Not found id')
        todolist.splice(targetIndex, 1)

        successHandle(res)
      } catch (error) {
        errorHandle(res, error)
      }
    })
  } else if (req.url === '/todos' && req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  } else {
    errorHandle(res, new Error('Wrong Request'))
  }
}

http.createServer(requestListener).listen(process.env.PORT || 3005)
