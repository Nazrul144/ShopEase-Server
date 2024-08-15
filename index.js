const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors())
app.use(express.json())





//Connecting api:
app.get('/', (req, res)=>{
    res.send("Server is running!")
})
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
})