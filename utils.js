const { headers, todolist } = require('./state.js')
const errorHandle = (res, error = { message: '程式出錯' }) => {
  res.writeHead(400, headers)
  res.write(
    JSON.stringify({
      status: false,
      massage: error.message,
    })
  )
  res.end()
}

const successHandle = (res) => {
  res.writeHead(200, headers)
  res.write(
    JSON.stringify({
      status: 'success',
      data: todolist,
    })
  )
  res.end()
}

exports.errorHandle = errorHandle

exports.successHandle = successHandle
