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

    // console.log(Preference);

    mercadopago.preferences.create(Preference).then(data=>{
        // console.log(data.body.init_point);
        res.redirect(data.body.init_point);
    })
    
})

app.post('/webhook', urlencodedParser, function (req, res) {
    console.log(req.body)
    console.log(req.query)
    res.status(200).send('some text')
    
})

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen((process.env.PORT || 3000), function(){
    console.log('listening');
});



// mercadopagoIpnResponse = {
//          body: {
//             acquirer_reconciliation: [],
//             additional_info: {
//                 available_balance: null,
//                 ip_address: '181.230.108.172',
//                 nsu_processadora: null
//             },
//             authorization_code: '1234567',
//             binary_mode: false,
//             brand_id: null,
//             call_for_authorize_id: null,
//             captured: true,
//             card: {
//                 cardholder: [Object],
//                 date_created: '2020-08-23T19:53:08.000-04:00',
//                 date_last_updated: '2020-08-23T19:53:08.000-04:00',
//                 expiration_month: 11,
//                 expiration_year: 2025,
//                 first_six_digits: '503175',
//                 id: null,
//                 last_four_digits: '0604'
//             },
//             charges_details: [],
//             collector_id: 469485398,
//             corporation_id: null,
//             counter_currency: null,
//             coupon_amount: 0,
//             currency_id: 'ARS',
//             date_approved: '2020-08-23T19:53:08.000-04:00',
//             date_created: '2020-08-23T19:53:08.000-04:00',
//             date_last_updated: '2020-08-23T19:53:08.000-04:00',
//             date_of_expiration: null,
//             deduction_schema: null,
//             description: 'Samsung',
//             differential_pricing_id: null,
//             external_reference: 'gaabicarp@gmail.com',
//             fee_details: [ [Object] ],
//             id: 9354235378,
//             installments: 1,
//             integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
//             issuer_id: '3',
//             live_mode: true,
//             marketplace_owner: null,
//             merchant_account_id: null,
//             merchant_number: null,
//             metadata: {},
//             money_release_date: '2020-08-23T19:53:08.000-04:00',
//             money_release_schema: null,
//             notification_url: 'https://mpgabi.herokuapp.com/webhook',
//             operation_type: 'regular_payment',
//             order: { id: '1707392928', type: 'mercadopago' },
//             payer: {
//                 email: 'test_user_63274575@testuser.com',
//                 entity_type: null,
//                 first_name: 'Lalo',
//                 id: '471923173',
//                 identification: [Object],
//                 last_name: 'Landa',
//                 operator_id: null,
//                 phone: [Object],
//                 type: 'guest'
//             },
//             payment_method_id: 'master',
//             payment_type_id: 'credit_card',
//             platform_id: null,
//             pos_id: null,
//             processing_mode: 'aggregator',
//             refunds: [],
//             shipping_amount: 0,
//             sponsor_id: null,
//             statement_descriptor: 'MERPAGO',
//             status: 'approved',
//             status_detail: 'accredited',
//             store_id: null,
//             taxes_amount: 0,
//             transaction_amount: 15000,
//             transaction_amount_refunded: 0,
//             transaction_details: {
//                 acquirer_reference: null,
//                 external_resource_url: null,
//                 financial_institution: null,
//                 installment_amount: 15000,
//                 net_received_amount: 13912.5,
//                 overpaid_amount: 0,
//                 payable_deferral_period: null,
//                 payment_method_reference_id: '1234567',
//                 total_paid_amount: 15000
//             }
//         },
//         status: 200,
//         id: '9354235378',
//         topic: 'payment'
//     }