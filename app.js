var express = require('express');
var app = express();
var port = 7800;
var superagent = require('superagent');
var request = require('request');

//Static files
app.use(express.static(__dirname+'/public'));
//html
app.set('views', './src');
//View engine
app.set('view engine','ejs');

app.get('/',(req,res) => {
    res.render('index')
})

app.get('/profile',(req,res) => {
    const code = req.query.code
    if(!code){
        res.send({
            success:false,
            message:'Error on Login'
        })
    }
    superagent
        .post("https://github.com/login/oauth/access_token")
        .send({
            client_id:"cc9cf86b45349498562d",
            client_secret:"687c893ac72f45a10239e21444e947acc5f82641",
            code:code
        })
        .set('Accept', 'application/json')
        .end((err,result) => {
            if(err) throw err;
            var accessToken = result.body.access_token;
            const option ={
                url:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept': 'application/json',
                    'Authorization':'token '+accessToken,
                    'User-Agent':'may-node'
                }
            }
            var output;
            request(option,(err,response,body)=>{
                output = body;
                return res.send(output)
            })

        })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

