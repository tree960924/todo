const express = require('express');
const app = express()
const port = 3000


app.use('/script', express.static(__dirname +'\\..\\src'));
app.use(express.static(__dirname + '\\..\\public'));




app.listen(port, ()=>{
    console.log(`server is running on port : ${port}`)
})