
require('./userInfo.js')
require('./users.js')
require('.././db.js')
require('.././index.js')
var md5 = require('md5')
const loggedInUser = 0
var crypto = require('crypto')
const express = require('express')
//var AES = require("crypto-js/aes");
//var SHA256 = require("crypto-js/sha256");
const { resolve } = require("path");
const stripe = require("stripe")('sk_test_d5oqBMqwCnaIkqZDOGwnfUse00gevHGKGj');
var path = "../noble-master"






var mongoose = require('mongoose')
var cookieKey = 'sid'
var sessionUser = {}
var cookieKey = 'sid'

stripe.setApiVersion('2020-08-27');

// Replace this list with information about your store's products.
const products = [
  {
    id: 'increment',
    name: 'Increment Magazine',
    price: 399,
    attributes: {issue: 'Issue #3 “Development”'},
  },
  {
    id: 'shirt',
    name: 'Stripe Shirt',
    price: 999,
    attributes: {size: 'Small Standard', gender: 'Woman'},
  },
  {
    id: 'pins',
    name: 'Stripe Pins',
    price: 799,
    attributes: {set: 'Collector Set'},
  },
];

  // Supported payment methods for the store.
  // Some payment methods support only a subset of currencies.
  // Make sure to check the docs: https://stripe.com/docs/sources
  const paymentMethods = [
    // 'ach_credit_transfer', // usd (ACH Credit Transfer payments must be in U.S. Dollars)
    'alipay', // aud, cad, eur, gbp, hkd, jpy, nzd, sgd, or usd.
    'bancontact', // eur (Bancontact must always use Euros)
    'card', // many (https://stripe.com/docs/currencies#presentment-currencies)
    'eps', // eur (EPS must always use Euros)
    'ideal', // eur (iDEAL must always use Euros)
    'giropay', // eur (Giropay must always use Euros)
    'multibanco', // eur (Multibanco must always use Euros)
    // 'sepa_debit', // Restricted. See docs for activation details: https://stripe.com/docs/sources/sepa-debit
    'p24', // eur, pln
    'sofort', // eur (SOFORT must always use Euros)
    'wechat', // aud, cad, eur, gbp, hkd, jpy, sgd, or usd.
  ]
  // Shipping options for the Payment Request API.
  const shippingOptions = [
    {
      id: 'free',
      label: 'Free Shipping',
      detail: 'Delivery within 5 days',
      amount: 0,
    },
    {
      id: 'express',
      label: 'Express Shipping',
      detail: 'Next day delivery',
      amount: 500,
    },
  ]

  // List all products.
/*const listProducts = async () => {
  return await stripe.products.list({limit: 3, type: 'good'});
};
// Retrieve a product by ID.
const retrieveProduct = async productId => {
  return await stripe.products.retrieve(productId);
};
// Get shipping cost from config based on selected shipping option.
const getShippingCost = shippingOption => {
  return shippingOptions.filter(
    option => option.id === shippingOption
  )[0].amount;
};
const products = {
  list: listProducts,
  retrieve: retrieveProduct,
  getShippingCost,
};*/
// Creates a collection of Stripe Products and SKUs to use in your storefront
const createStoreProducts = async () => {
  try {
    const stripeProducts = await Promise.all(
      products.map(async product => {
        const stripeProduct = await stripe.products.create({
          id: product.id,
          name: product.name,
          type: 'good',
          attributes: Object.keys(product.attributes),
          metadata: product.metadata,
        });

        const stripeSku = await stripe.skus.create({
          product: stripeProduct.id,
          price: product.price,
          currency: config.currency,
          attributes: product.attributes,
          inventory: {type: 'infinite'},
        });

        return {stripeProduct, stripeSku};
      })
    );

    console.log(
      `🛍️  Successfully created ${stripeProducts.length} products on your Stripe account.`
    );
  } catch (error) {
    console.log(`⚠️  Error: ${error.message}`);
  }
};

createStoreProducts();

const calculatePaymentAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};




module.exports = (app) => {


  app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);



// Create the PaymentIntent on the backend.
app.post('/payment_intents', async (req, res, next) => {
  let {currency, items} = req.body;
  const amount = await calculatePaymentAmount(items);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: paymentMethods,
    });
    return res.status(200).json({paymentIntent});
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});


// Update PaymentIntent with shipping cost.
app.post('/payment_intents/:id/shipping_change', async (req, res, next) => {
  const {items, shippingOption} = req.body;
  let amount = await calculatePaymentAmount(items);
  amount += products.getShippingCost(shippingOption.id);

  try {
    const paymentIntent = await stripe.paymentIntents.update(req.params.id, {
      amount,
    });
    return res.status(200).json({paymentIntent});
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});




// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// Webhook handler to process payments for sources asynchronously.
app.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (1) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        'whsec_xp5Gxx51rcyAwCMpPXu2lUfzK2dXA4iP'
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  const object = data.object;

  // Monitor payment_intent.succeeded & payment_intent.payment_failed events.
  if (object.object === 'payment_intent') {
    const paymentIntent = object;
    if (eventType === 'payment_intent.succeeded') {
      console.log(
        `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`
      );
    } else if (eventType === 'payment_intent.payment_failed') {
      const paymentSourceOrMethod = paymentIntent.last_payment_error
        .payment_method
        ? paymentIntent.last_payment_error.payment_method
        : paymentIntent.last_payment_error.source;
      console.log(
        `🔔  Webhook received! Payment on ${paymentSourceOrMethod.object} ${paymentSourceOrMethod.id} of type ${paymentSourceOrMethod.type} for PaymentIntent ${paymentIntent.id} failed.`
      );
      // Note: you can use the existing PaymentIntent to prompt your customer to try again by attaching a newly created source:
      // https://stripe.com/docs/payments/payment-intents/usage#lifecycle
    }
  }

  // Monitor `source.chargeable` events.
  if (
    object.object === 'source' &&
    object.status === 'chargeable' &&
    object.metadata.paymentIntent
  ) {
    const source = object;
    console.log(`🔔  Webhook received! The source ${source.id} is chargeable.`);
    // Find the corresponding PaymentIntent this source is for by looking in its metadata.
    const paymentIntent = await stripe.paymentIntents.retrieve(
      source.metadata.paymentIntent
    );
    // Check whether this PaymentIntent requires a source.
    if (paymentIntent.status != 'requires_payment_method') {
      return res.sendStatus(403);
    }
    // Confirm the PaymentIntent with the chargeable source.
    await stripe.paymentIntents.confirm(paymentIntent.id, {source: source.id});
  }

  // Monitor `source.failed` and `source.canceled` events.
  if (
    object.object === 'source' &&
    ['failed', 'canceled'].includes(object.status) &&
    object.metadata.paymentIntent
  ) {
    const source = object;
    console.log(`🔔  The source ${source.id} failed or timed out.`);
    // Cancel the PaymentIntent.
    await stripe.paymentIntents.cancel(source.metadata.paymentIntent);
  }

  // Return a 200 success code to Stripe.
  res.sendStatus(200);
});


// Expose the Stripe publishable key and other pieces of config via an endpoint.
app.get('/config', (req, res) => {
  res.json({
    stripePublishableKey: 'pk_test_fiywKA9j31kB6XtlhwKzDxIR00CLXcWGnv',
    stripeCountry: 'US',
    country: 'US',
    currency: 'eur',
    paymentMethods: paymentMethods,
    shippingOptions: shippingOptions,
  });
});

  // Retrieve all products.
  app.get('/products', async (req, res) => {
  res.json(await products.list());
  });
  // Retrieve a product by ID.
  app.get('/products/:id', async (req, res) => {
  res.json(await products.retrieve(req.params.id));
  });


// Retrieve the PaymentIntent status.
app.get('/payment_intents/:id/status', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
  const payload = {status: paymentIntent.status};

  if (paymentIntent.last_payment_error) {
    payload.last_payment_error = paymentIntent.last_payment_error.message;
  }

  res.json({paymentIntent: payload});
});














 
   app.get("/stripe.html", (req, res) => {
  // Display checkout page
  const path = resolve(path + "/stripe.html");
  res.sendFile(path);
  });

  
  
}