const express = require('express');
const app = express();
const route = require('./routes/userDetails')

app.use(express.json());
app.use(route);


app.listen(3001,()=>{
    console.log('listening to port 3001')
})