const http= require('http')
const server =http.createServer((req,res)=>{

  res.write('<h1>i am achapi</h1>')


  res.end('\nbye bye')
})
server.listen(1000)