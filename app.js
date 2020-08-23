var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});
 
var app = express();

var urlencodedParser = bodyParser.urlencoded({extended : false})


 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/success', function(req,res){
    res.render('success', req.query)
})

app.get('/pending', function(req,res){
    res.render('pending')
})

app.get('/failure', function(req,res){
    res.render('failure')
})

app.post('/pagar', urlencodedParser, function(req, res){
    // console.log(req.body)
    let Preference = {
        items: [
            {
            id: '1234',
            title: req.body.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            quantity: 1,
            unit_price: JSON.parse(req.body.price),
            picture_url: 'https://mpgabi.herokuapp.com' + req.body.img,
            }
        ],
        external_reference: 'gaabicarp@gmail.com',
        payer:{
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_63274575@testuser.com',
            phone:{
                area_code: '11',
                number: 22223333
            },
            address:{
                zip_code: '1111',
                street_name: 'False',
                street_number: 123
            }
        },
        back_urls:{
            success: 'https://mpgabi.herokuapp.com/success',
            pending: 'https://mpgabi.herokuapp.com/pending',
            failure: 'https://mpgabi.herokuapp.com/failure',
        },
        auto_return: 'approved',
        payment_methods:{
            excluded_payment_methods:[
                {
                    id: "amex"
                }
            ],
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        notification_url: 'https://mpgabi.herokuapp.com/webhook?source_news=webhooks'
        }

    mercadopago.preferences.create(Preference).then(data=>{
        // console.log(data.body.init_point);
        res.redirect(data.body.init_point);
    })
    
})

app.post('/webhook', function(req, res){
    console.log('webhook', req.query);
    console.log('todo',req)
    res.status(200);
})

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen((process.env.PORT || 3000), function(){
    console.log('listening');
});