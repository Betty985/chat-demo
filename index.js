const express=require('express')
const app=express()
const http=require('http')
const server=http.createServer(app)
const {Server}=require('socket.io')
const io=new Server(server)
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})
// 向除本人之外的所有人广播
// socket.broadcast.emit('hi');
let sessionList=new Map()
io.on('connection',(socket)=>{
    console.log('connected')
   socket.on('add user',({id,nickName})=>{
    socket.id=id
    sessionList.set(id,nickName)
    io.emit('user joined',{id,nickName})
   })

    socket.on('chat message',(msg)=>{
        io.emit('chat message',msg)
        console.log('message:'+msg)
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected')
        socket.broadcast.emit('user leave',{
            id:socket.id,
            nickName:sessionList.get(socket.id)
        })
    })
})
server.listen(3000,()=>{
    console.log('3000')
})
