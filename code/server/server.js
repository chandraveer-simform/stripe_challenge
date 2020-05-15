const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
// const { resolve } = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const stripe = require('stripe')('sk_test_5L5PmnUzR3JGy4hQ2aeYbFyr00g5UlrayT');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const allitems = {};

// const MIN_ITEMS_FOR_DISCOUNT = 2;
app.use(express.static(process.env.STATIC_DIR));

app.use(
  express.json({
    // Should use middleware or a function to compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.get('/config', (req, res) => {
  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
    basePrice: process.env.BASE_PRICE,
    currency: process.env.CURRENCY,
  });
});

// load items file for video courses
let file = require("../items.json");
file.forEach(function(item) {
  item.selected = false;
  allitems[item.itemId] = item;
});


// load config file
let fs = require("fs");
let configFile = fs.readFileSync("../config.json");
const config = JSON.parse(configFile);

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
//// Get started! Shows the main page of the challenge with links to the
// different sections.
app.get("/", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/index.html");
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path); 
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});
 


// Challenge Section 1
// Challenge section 1: shows the concert tickets page. 
app.post('/create-checkout-session', async (req, res) => {
    const domainURL = process.env.WEBDOMAIN;  
    const { quantity, locale } = req.body;
    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [payment_intent_data] - lets capture the payment later
    // [customer_email] - lets you prefill the email input in the form
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // locale: locale,
      line_items: [
        {
          name: 'Spring Academy Concert',
          images: ['https://cleverclicksdigital.com/wp-content/uploads/2019/05/jason-rosewell-60014-unsplash-1.jpg'], 
          quantity: quantity,
          currency: process.env.CURRENCY,
          amount: process.env.BASE_PRICE_CONCERT, // Keep the amount on the server to prevent customers from manipulating on client
        },
      ],
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/concert-success/:id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/concert-faild/:id`,
    });
  
    res.send({
      sessionId: session.id,
    });
  });


app.get("/concert", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/concert.html");
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});


app.get("/setup-concert-page", (req, res) => {
  res.send({ 
    basePrice: config.checkout_base_price,
    currency: config.checkout_currency
  });
});

//show success page, after user buy concert tickets
app.get("/concert-success", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/concert-success.html");
    console.log(path);
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
})

// Chalellenge Section 2
// Challenge section 2: shows the videos purchase page.
app.post("/pay", async (req, res) =>{
  
  const {email} = req.body;
  const {amount} = req.body;
  console.log("amount",amount)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    // customer: customer,
    metadata: {integration_check: 'accept_a_payment'},
    receipt_email: email,
  });
  
  // res.json({'client_secret': paymentIntent['client_secret']})
  
  res.end( JSON.stringify({'client_secret': paymentIntent['client_secret']}));
  
});

app.get("/videos", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/videos.html");
    console.log("video call", process.env.STATIC_DIR)
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path); 
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});

// Challenge section 2: returns config information that is used by the client JavaScript
// to display the videos page.
app.get("/setup-video-page", (req, res) => {
  res.send({ 
    discountFactor: config.video_discount_factor,
    minItemsForDiscount: config.video_min_items_for_discount,
    items: allitems,
  });
});

// Challenge Section 3
// Challenge section 3: shows the lesson sign up page.
app.get("/lessons", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/lessons.html");
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});

// Challenge Section 3
// Displays the account update page for a given customer
app.get("/account-update/:customer_id", (req, res) => {
  try {
    const path = resolve(process.env.STATIC_DIR + "/account-update.html");
    if (!fs.existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});


// Challenge section 3: '/schedule-lesson'
// Authorize a payment for a lesson
//
// Parameters:
// customer_id: id of the customer
// amount: amount of the lesson in cents
// description: a description of this lesson
//
// Example call:
// curl -X POST http://localhost:4242/schedule_lesson \
//  -d customer_id=cus_GlY8vzEaWTFmps \
//  -d amount=4500 \
//  -d description="Lesson on Feb 25th"
//
// Returns: a JSON response of one of the following forms:
// For a successful payment, return the payment intent:
//   {
//        payment: <payment_intent>
//    }
//
// For errors:
//  {
//    error:
//       code: the code returned from the Stripe error if there was one
//       message: the message returned from the Stripe error. if no payment method was
//         found for that customer return an msg "no payment methods found for <customer_id>"
//    payment_intent_id: if a payment intent was created but not successfully authorized
// }
// app.post("/schedule-lesson-data", async (req, res) => {
//   const stripe = require('stripe')('sk_test_5L5PmnUzR3JGy4hQ2aeYbFyr00g5UlrayT');
  
//   res.send({
//     customer,
//   });
// });

// app.post("/schedule-lesson", async (req, res) => {
//   const customer = await stripe.customers.create(); 
//   res.end( JSON.stringify({'client_secret': customer['client_secret'], 'customer_id':customer.id}));
  
// });

app.get('/schedule-lesson', async (req, res) => {
  const customer = await stripe.customers.create(); 
  const intent =  await stripe.setupIntents.create({
    customer: customer.id,
  });
  // res.end('card_wallet', { client_secret: intent.client_secret });
  res.end( JSON.stringify({'client_secret': intent['client_secret'], 'customer_id':customer.id}));
});


app.post("/schedule-lessonAA", async (req, res) => { 
  try {
    const customer = await stripe.customers.create();
    console.log(customer.id)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 0,
      currency: 'usd',
      customer: customer.id,
      payment_method: 'card',
      off_session: true,
      confirm: true,
    });
    res.end( JSON.stringify({'client_secret': paymentIntent['client_secret']}));

  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log('Error code is: ', err.code);
    console.log('--------------------'); 

    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    console.log("PID",paymentIntentRetrieved)
    console.log('PI retrieved: ', paymentIntentRetrieved.id);
  }
});

// Challenge section 3: '/complete-lesson-payment'
// Capture a payment for a lesson.
//
// Parameters:
// amount: (optional) amount to capture if different than the original amount authorized
//
// Example call:
// curl -X POST http://localhost:4242/complete_lesson_payment \
//  -d payment_intent_id=pi_XXX \
//  -d amount=4500
//
// Returns: a JSON response of one of the following forms:
//
// For a successful payment, return the payment intent:
//   {
//        payment: <payment_intent>
//    }
//
// for errors:
//  {
//    error:
//       code: the code returned from the error
//       message: the message returned from the error from Stripe
// }
//
app.post("/complete-lesson-payment", async (req, res) => {});


// Challenge section 3: '/delete-account'
// Deletes a customer object if there are no uncaptured payment intents for them.
//
// Parameters: 
//   customer_id: the id of the customer to delete
//
// Example request
//   curl -X POST http://localhost:4242/delete-account \
//    -d customer_id=cusXXX
//
// Returns 1 of 3 responses:
// If the customer had no uncaptured charges and was successfully deleted returns the response:
//   {
//        deleted: true
//   }
//
// If the customer had uncaptured payment intents, return a list of the payment intent ids:
//   {
//     uncaptured_payments: ids of any uncaptured payment intents
//   }
//
// If there was an error:
//  {
//    error: {
//        code: e.error.code,
//        message: e.error.message
//      }
//  }
//
app.post("/delete-account/:customer_id", async (req, res) => {});


// Challenge section 3: '/refund-lesson'
// Refunds a lesson payment.  Refund the payment from the customer (or cancel the auth
// if a payment hasn't occurred).
// Sets the refund reason to 'requested_by_customer'
//
// Parameters:
// payment_intent_id: the payment intent to refund
// amount: (optional) amount to refund if different than the original payment
//
// Example call:
// curl -X POST http://localhost:4242/refund-lesson \
//   -d payment_intent_id=pi_XXX \
//   -d amount=2500
//
// Returns
// If the refund is successfully created returns a JSON response of the format:
// 
// {
//   refund: refund.id
// }
//
// If there was an error:
//  {
//    error: {
//        code: e.error.code,
//        message: e.error.message
//      }
//  }
app.post("/refund-lesson", async (req, res) => {});


// Challenge section 3: '/calculate-lesson-total'
// Returns the total amounts for payments for lessons, ignoring payments
// for videos and concert tickets.
//
// Example call: curl -X GET http://localhost:4242/calculate-lesson-total
//
// Returns a JSON response of the format:
// {
//      payment_total: total before fees and refunds (including disputes), and excluding payments
//         that haven't yet been captured.
//         This should be equivalent to net + fee totals.
//      fee_total: total amount in fees that the store has paid to Stripe
//      net_total: net amount the store has earned from the payments.
// }
//
app.get("/calculate-lesson-total", (req, res) => {});


// Challenge section 3: '/find-customers-with-failed-payments'
// Returns any customer who meets the following conditions:
// The last attempt to make a payment for that customer failed.
// The payment method associated with that customer is the same payment method used
// for the failed payment, in other words, the customer has not yet supplied a new payment method.
//
// Example request: curl -X GET http://localhost:4242/find-customers-with-failed-payments
//
// Returns a JSON response with information about each customer identified and their associated last payment
// attempt and, if they have a payment method on file, info about the payment method
// {
//   <customer_id>:
//     customer: {
//       email: customer.email,
//       name: customer.name,
//       card_on_file: [true| false] returns whether a customer has a card associated with them.
//     },
//     payment_intent: {
//       created: created timestamp for the payment intent
//       description: description from the payment intent
//       status: the status of the payment intent
//       error: the error returned from the payment attempt
//     },
//     payment_method: {
//       last4: last four of the card stored on the customer
//       brand: brand of the card stored on the customer
//     }
//   },
//   <customer_id>: {},
//   <customer_id>: {},
// }
//
app.get("/find-customers-with-failed-payments", (req, res) => {});

function errorHandler(err, req, res, next) {
  res.status(500).send({ error: { message: err.message } });
}

app.use(errorHandler);

app.listen(4242, () => console.log(`Node server listening on port http://localhost:${4242}`));

