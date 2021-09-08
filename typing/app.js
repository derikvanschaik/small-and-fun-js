const path  = require('path');  
const express = require('express');
const randomSentence = require('./randomsentence'); 

const app = express();

app.use(express.static(path.join(__dirname, './public') ));  

app.get('/', (req, res) =>{
      res.sendFile(path.join(__dirname, './public/html/typing.html'));  
});
app.get('/random-sentence', (req, res) =>{
    const sentence = randomSentence(10); // 10 word sentences for now
    res.send({sentence});   
});

app.listen(3000, () =>{
    console.log(`Listening on port 3000`);   
}); 