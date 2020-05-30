const express = require ('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');


const app =express();
//ndlebars middleware   ha
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
//body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
//set static folder
app.use(express.static(`${__dirname}/public`));
app.get('/', (req,res) =>{
    res.render('index',  {
      stripePublishableKey: keys.stripePublishableKey
      
    });
})

//charge route
// Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
  
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
      amount,
      description: 'Web Development Ebook',
      currency: 'usd',
      customer: customer.id
    }))
    .then( charge => res.render('success'));
  });
const port = process.env.port || 5000;
app.listen(port, () =>{
    console.log(`server started on port ${port}`);
});