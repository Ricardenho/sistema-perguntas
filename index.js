const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/database')
const modelPergunta = require('./database/Pergunta')
const modelResposta = require('./database/Resposta')
//database
connection.authenticate().then( () => {console.log('Conexão feita com Sucesso')}).catch((msgErro) => {msgErro})
//.then só executa qdo a conexão com o Banco é feita com sucesso

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROTAS
app.get('/', (req, res) => {
    modelPergunta.findAll({raw : true, order:[
        ['id', 'DESC'] //ASC=crescente, DESC=Descrescente | ['titulo', 'ASC] iria ordenar por ordem alfabetica
    ]}/*siginifica que vai buscar as informações cruas*/).then(perguntas => {
        res.render('index', { perguntas:perguntas})
});
 
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
});

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo
    var desc = req.body.descricao
    modelPergunta.create({titulo:titulo, descricao:desc}).then(()=>{res.redirect('/')})
});

app.get('/pergunta/:id', (req, res) => {
    var id=req.params.id
    modelPergunta.findOne({ where:{id:id}}).then(pergunta => {
        if(pergunta != undefined){//pergunta encontrada
            modelResposta.findAll({where: {perguntaId:id}}).then(respostas => {res.render('pergunta',{pergunta:pergunta, respostas:respostas})})
        }
        else{//pergunta não encontrada
            res.redirect('/')
        }
    })     
});

app.post('/responder' , (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    modelResposta.create({corpo:corpo, perguntaId:perguntaId}).then(()=>{res.redirect('/pergunta/'+perguntaId)})
})
app.listen(8080, () => {console.log('App Rodando')});