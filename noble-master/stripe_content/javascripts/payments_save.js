/**
 * payments.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * This modern JavaScript file handles the checkout process using Stripe.
 *
 * 1. It shows how to accept card payments with the `card` Element, and
 * the `paymentRequestButton` Element for Payment Request and Apple Pay.
 * 2. It shows how to use the Stripe Sources API to accept non-card payments,
 * such as iDEAL, SOFORT, SEPA Direct Debit, and more.
 */
let stripe;
let card;

(async () => {
  'use strict';

  // Retrieve the configuration for the store.
  const config = await store.getConfig();
  console.log("Config is "  + config);

  // Create references to the main form and its submit button.
  const form = document.getElementById('apayment-form');
  

  /**
   * Setup Stripe Elements.
   */

  // Create a Stripe client.
  const stripe = Stripe('pk_test_fiywKA9j31kB6XtlhwKzDxIR00CLXcWGnv');

  // Create an instance of Elements.
  const elements = stripe.elements();

  // Prepare the styles for Elements.
  const style = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#d1bb95',
      },
      ':-webkit-autofill': {
        color: '#f0c375',
      },
    },
  };

  /**
   * Implement a Stripe Card Element that matches the look-and-feel of the app.
   *
   * This makes it easy to collect debit and credit card payments information.
   */

  // Create a Card Element and pass some custom styles to it.
  card = elements.create('card', {style, hidePostalCode: true});

  // Mount the Card Element on the page.
  card.mount('#card-element');

  // Monitor change events on the Card Element to display any errors.
  card.on('change', ({error}) => {
    const cardErrors = document.getElementById('card-errors');
    if (error) {
      cardErrors.textContent = error.message;
      cardErrors.classList.add('visible');
    } else {
      cardErrors.classList.remove('visible');
    }
    
  });

  // Create the payment request.
  const paymentRequest = stripe.paymentRequest({
    country: config.stripeCountry,
    currency: config.currency,
    total: {
      label: 'Total',
      amount: store.getPaymentTotal(),
    },
    requestShipping: true,
    requestPayerEmail: true,
    shippingOptions: config.shippingOptions,
  });


  /**
   * Handle the form submission.
   *
   * This uses Stripe.js to confirm the PaymentIntent using payment details collected
   * with Elements.
   *
   * Please note this form is not submitted when the user chooses the "Pay" button
   * or Apple Pay, Google Pay, and Microsoft Pay since they provide name and
   * shipping information directly.
   */

  // Listen to changes to the user-selected country.
  form
    .querySelector('select[name=country]')
    .addEventListener('change', (event) => {
      event.preventDefault();
      selectCountry(event.target.value);
    });

  // Submit handler for our payment form.
  const mainElement = document.getElementById('main');
  mainElement.classList.add('checkout');
  document.getElementById('main').classList.remove('loading');

  /////Code to allow for saving the card
   const url2 = 'https://0d7cf27c774c.ngrok.io';

  form.addEventListener("submit", async event => {
      event.preventDefault();
      if (0 == 1) {
        // Invlaid phone number, return error message, abort
        phoneInputField.setCustomValidity("Invalid phone number!");
        signupForm.reportValidity();
        setTimeout(function() {
          phoneInputField.setCustomValidity("");
        }, 4000);
        return;
      }
      //changeLoadingState(true, 0);
      // Create Customer

      //create card token
      /*const token = await stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 9,
          exp_year: 2021,
          cvc: '314',
        },
      });

      type: 'card',
    card: cardElement,
    billing_details: {
      name: 'Jenny Rosen',
    }*/
    
    //create card token to then be stored in customer information
    /*const token = stripe.createToken(cardElement).then(function(result) {
    // Handle result.error or result.token
    }).catch(error => console.log("Card token failed to create: " + error));*/

    //create card token to then be stored in customer information
    /*const token = stripe.tokens.create({
        card: card
      });*/

      

      //console.log("paymentMethod_id " + localStorage.getItem("paymentMethod_id"));
      //console.log("paymentMethod_id " + localStorage.getItem("paymentMethod_id").slice(0,localStorage.getItem("paymentMethod_id").length - 1));
      const { checkoutSession, error } = await createCustomer();
      //console.log("this is the card token " + token);
      console.log("206: printing checkoutSession" + JSON.stringify(checkoutSession));
      //window.location.replace(JSON.stringify(checkoutSession.success_url));
      //window.location.replace(url2 .concat("/stripe.html?session_id=" , JSON.stringify(checkoutSession.id).slice(1,64)));
      var session_id = JSON.stringify(checkoutSession.id).slice(1,65);
       //create payment method
      stripe.createPaymentMethod({
          type: 'card',
          card: card,
          /*billing_details: {
              name: document.querySelector("#name").value,
              address: {
                "city": document.querySelector("#city").value,
                "country": document.querySelector("#country").value,
                "line1": document.querySelector("#address").value,
                "line2": null,
                "postal_code": document.querySelector("#postal_code").value,
                "state": document.querySelector("#state").value
              }
            },*/
            }
          ).then(function(result) {
            if (result.error) {
              // Display error.message in your UI
              //resultContainer.textContent = result.error.message;
              console.log("Failed to create payment method from card" + result.error.message);
            } else {
              // You have successfully created a new PaymentMethod
              //resultContainer.textContent = "Created payment method: " + result.paymentMethod.id;
              console.log("YAYYY card created: " +result.paymentMethod.id );
              localStorage.setItem(
                "paymentMethod_id", result.paymentMethod.id     
              );
              /*const paymentMethod = stripe.paymentMethods.attach(
                paymentMethod,
                {customer: customer.id}
              );*/
              
            }
          });
      //session_id = JSON.stringify(checkoutSession.id)
      /*localStorage.setItem(
          "session_id", JSON.stringify(checkoutSession.id)     
        );*/
      
      
      if (error) {
        alert(error.message);
        //changeLoadingState(false, 0);
        console.log("This is the message");
        return;
      }

      //add customer card information to customer object
      /*const returnedCard = await createSource(
        checkoutSession.customer.id,
        {source: localStorage.getItem("paymentMethod_id")}
      );*/

      /*const paymentMethodAttachment = await stripe.paymentMethods.attach(
        localStorage.getItem("paymentMethod_id"),
        {customer: checkoutSession.customer.id}
        );

      const customer = await stripe.customers.update(checkoutSession.customer.id, {
        source: localStorage.getItem("paymentMethod_id"),
      });

      console.log("result of attached card creation is " + JSON.stringify({paymentMethodAttachement}));*/
      // Recirect to Checkout
      //await stripe.redirectToCheckout({ sessionId: checkoutSession.id });

      //Instead of redirecting to checkout, add button listener
      //const session_id = (localStorage.getItem("session_id"));
      console.log("Things are about to get good, we should get a log message about a checkout session soon");
      console.log(session_id);
      //const url = new URL(window.location.href);
      //const session_id = url.searchParams.get("session_id");
    if (session_id) {
      console.log("about to call checkoutSession backend");
      console.log(session_id.length); 
      const { checkoutSession } =  await fetch(
        `checkout-session/${session_id}`
      ).then(res => res.json());
      console.log("called checkoutSession");
      console.log(checkoutSession);
      if (checkoutSession) {
        // Store customer details in localStorage
        console.log("This checkout thing is the bomb diggity");
        localStorage.setItem(
          "customer",
          JSON.stringify({
            id: checkoutSession.customer.id,
            email: checkoutSession.customer.email,
            //last4: checkoutSession.setup_intent.payment_method.card.last4
          })
        );
        //window.location.replace("/");
      }
    } else{
      console.log("session id is was null");
    }




      
    





    });



  /**
   * Display the relevant payment methods for a selected country.
   */

  // List of relevant countries for the payment methods supported in this demo.
  // Read the Stripe guide: https://stripe.com/payments/payment-methods-guide
  const paymentMethods = {
    ach_credit_transfer: {
      name: 'Bank Transfer',
      flow: 'receiver',
      countries: ['US'],
      currencies: ['usd'],
    },
    alipay: {
      name: 'Alipay',
      flow: 'redirect',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
    bancontact: {
      name: 'Bancontact',
      flow: 'redirect',
      countries: ['BE'],
      currencies: ['eur'],
    },
    card: {
      name: 'Card',
      flow: 'none',
    },
    eps: {
      name: 'EPS',
      flow: 'redirect',
      countries: ['AT'],
      currencies: ['eur'],
    },
    ideal: {
      name: 'iDEAL',
      flow: 'redirect',
      countries: ['NL'],
      currencies: ['eur'],
    },
    giropay: {
      name: 'Giropay',
      flow: 'redirect',
      countries: ['DE'],
      currencies: ['eur'],
    },
    multibanco: {
      name: 'Multibanco',
      flow: 'receiver',
      countries: ['PT'],
      currencies: ['eur'],
    },
    p24: {
      name: 'Przelewy24',
      flow: 'redirect',
      countries: ['PL'],
      currencies: ['eur', 'pln'],
    },
    sepa_debit: {
      name: 'SEPA Direct Debit',
      flow: 'none',
      countries: [
        'FR',
        'DE',
        'ES',
        'BE',
        'NL',
        'LU',
        'IT',
        'PT',
        'AT',
        'IE',
        'FI',
      ],
      currencies: ['eur'],
    },
    sofort: {
      name: 'SOFORT',
      flow: 'redirect',
      countries: ['DE', 'AT'],
      currencies: ['eur'],
    },
    wechat: {
      name: 'WeChat',
      flow: 'none',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
  };

  // Update the main button to reflect the payment method being selected.
  const updateButtonLabel = (paymentMethod, bankName) => {
    let amount = store.formatPrice(store.getPaymentTotal(), config.currency);
    let name = paymentMethods[paymentMethod].name;
    let label = `Pay ${amount}`;
    if (paymentMethod !== 'card') {
      label = `Pay ${amount} with ${name}`;
    }
    if (paymentMethod === 'wechat') {
      label = `Generate QR code to pay ${amount} with ${name}`;
    }
    if (paymentMethod === 'sepa_debit' && bankName) {
      label = `Debit ${amount} from ${bankName}`;
    }
    //updateSubmitButtonPayText(label);
  };

  const selectCountry = (country) => {
    const selector = document.getElementById('country');
    selector.querySelector(`option[value=${country}]`).selected = 'selected';
    selector.className = `field ${country.toLowerCase()}`;

    // Trigger the methods to show relevant fields and payment methods on page load.
    showRelevantFormFields();
    showRelevantPaymentMethods();
  };

  // Show only form fields that are relevant to the selected country.
  const showRelevantFormFields = (country) => {
    if (!country) {
      country = form.querySelector('select[name=country] option:checked').value;
    }
    const zipLabel = form.querySelector('label.zip');
    // Only show the state input for the United States.
    zipLabel.parentElement.classList.toggle(
      'with-state',
      ['AU', 'US'].includes(country)
    );
    // Update the ZIP label to make it more relevant for each country.
    const zipInput = form.querySelector('label.zip input');
    const zipSpan = form.querySelector('label.zip span');
    switch (country) {
      case 'US':
        zipSpan.innerText = 'ZIP';
        zipInput.placeholder = '94103';
        break;
      case 'GB':
        zipSpan.innerText = 'Postcode';
        zipInput.placeholder = 'EC1V 9NR';
        break;
      case 'AU':
        zipSpan.innerText = 'Postcode';
        zipInput.placeholder = '3000';
        break;
      default:
        zipSpan.innerText = 'Postal Code';
        zipInput.placeholder = '94103';
        break;
    }

    // Update the 'City' to appropriate name
    const cityInput = form.querySelector('label.city input');
    const citySpan = form.querySelector('label.city span');
    switch (country) {
      case 'AU':
        citySpan.innerText = 'City / Suburb';
        cityInput.placeholder = 'Melbourne';
        break;
      default:
        citySpan.innerText = 'City';
        cityInput.placeholder = 'Atlanta';
        break;
    }
  };

  // Show only the payment methods that are relevant to the selected country.
  const showRelevantPaymentMethods = (country) => {
    if (!country) {
      country = form.querySelector('select[name=country] option:checked').value;
    }
    const paymentInputs = form.querySelectorAll('input[name=payment]');
    for (let i = 0; i < paymentInputs.length; i++) {
      let input = paymentInputs[i];
      input.parentElement.classList.toggle(
        'visible',
        input.value === 'card' ||
          (config.paymentMethods.includes(input.value) &&
            paymentMethods[input.value].countries.includes(country) &&
            paymentMethods[input.value].currencies.includes(config.currency))
      );
    }

    // Hide the tabs if card is the only available option.
    const paymentMethodsTabs = document.getElementById('payment-methods');
    paymentMethodsTabs.classList.toggle(
      'visible',
      paymentMethodsTabs.querySelectorAll('li.visible').length > 1
    );

    // Check the first payment option again.
    paymentInputs[0].checked = 'checked';
    form.querySelector('.payment-info.card').classList.add('visible');
    form.querySelector('.payment-info.ideal').classList.remove('visible');
    form.querySelector('.payment-info.sepa_debit').classList.remove('visible');
    form.querySelector('.payment-info.wechat').classList.remove('visible');
    form.querySelector('.payment-info.redirect').classList.remove('visible');
    updateButtonLabel(paymentInputs[0].value);
  };

  // Listen to changes to the payment method selector.
  for (let input of document.querySelectorAll('input[name=payment]')) {
    input.addEventListener('change', (event) => {
      event.preventDefault();
      const payment = form.querySelector('input[name=payment]:checked').value;
      const flow = paymentMethods[payment].flow;

      // Update button label.
      updateButtonLabel(event.target.value);

      // Show the relevant details, whether it's an extra element or extra information for the user.
      form
        .querySelector('.payment-info.card')
        .classList.toggle('visible', payment === 'card');
      form
        .querySelector('.payment-info.ideal')
        .classList.toggle('visible', payment === 'ideal');
      form
        .querySelector('.payment-info.sepa_debit')
        .classList.toggle('visible', payment === 'sepa_debit');
      form
        .querySelector('.payment-info.wechat')
        .classList.toggle('visible', payment === 'wechat');
      form
        .querySelector('.payment-info.redirect')
        .classList.toggle('visible', flow === 'redirect');
      form
        .querySelector('.payment-info.receiver')
        .classList.toggle('visible', flow === 'receiver');
      document
        .getElementById('card-errors')
        .classList.remove('visible', payment !== 'card');
    });
  }

  // Select the default country from the config on page load.
  let country = config.country;
  // Override it if a valid country is passed as a URL parameter.
  const urlParams = new URLSearchParams(window.location.search);
  let countryParam = urlParams.get('country')
    ? urlParams.get('country').toUpperCase()
    : config.country;
  if (form.querySelector(`option[value="${countryParam}"]`)) {
    country = countryParam;
  }
  selectCountry(country);


  
})();


const url2 = 'https://0d7cf27c774c.ngrok.io'; 

//async function chargeCard() {
document.getElementById("charge-card").addEventListener("click", async event => {
  // Check if customer has been remembered
  event.preventDefault();
  console.log("In the charge card function");

  const rememberedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (rememberedCustomer) {
     const verificationResponse = await fetch("/start-twilio-verify", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerId: rememberedCustomer.id })
          }).then(res => res.json());

          if (verificationResponse.status === "pending") {
            //document.getElementById("payment-view").classList.add("hidden");
            //document.getElementById("verify-view").classList.remove("hidden");
            /*document.getElementsByClassName(
          "charge-card"
        )[1].innerText = `Pay with card ending in ${rememberedCustomer.last4}`;*/

              const { error, paymentIntent } = await fetch(
                "/check-twilio-verify",
                {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json"
                },
                  body: JSON.stringify({
                    customerId: rememberedCustomer.id,
                    //code: document.getElementById("verify-code").value,
                    items: ["cart_item"]
                  })
                }
              ).then(res => res.json());

              if (error) {
                showError(error.message);
              } else {
                if (paymentIntent.status === "requires_action") {
                  // The payment requires bank authentication
                  orderComplete(
                    await stripe.confirmCardPayment(paymentIntent.client_secret)
                  );
                } else {
                  orderComplete(paymentIntent);
                  console.log("We swiped that card BABY");
                }
              }
          }
    }
});


async function createCustomer() {
  return await fetch(url2 + "/create-customer", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        address: {
          line1:  document.querySelector("#address").value,
          city:    document.querySelector("#city").value,
          state:  document.querySelector("#state").value,
          postal_code:     document.querySelector("#postal_code").value,
          country:  document.querySelector("#country").value
        },
        
        paymentMethodId: localStorage.getItem("paymentMethod_id")
        /*invoice_settings: {
          custom_fields: null,
          default_payment_method: localStorage.getItem("paymentMethod_id"),
          footer: null }*/
    })
  }).then(res => res.json());
  //.then(text => console.log(text));
}

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
function orderComplete(paymentIntent) {
  const paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

  document.querySelector("#verify-form").classList.add("hidden");
  document.querySelector("pre").textContent = paymentIntentJson;

  document.querySelector(".sr-result").classList.remove("hidden");
  setTimeout(function() {
    document.querySelector(".sr-result").classList.add("expand");
  }, 200);
}

function showError(errorMsgText) {
  //changeLoadingState(false, 2);
  const errorMsg = document.querySelector(".sr-field-error");
  //errorMsg.textContent = errorMsgText;
  console.log("There was an error : " + errorMsg)
  /*setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);*/
}

// Show a spinner on payment submission
function changeLoadingState(isLoading, i) {
  if (isLoading) {
    document.getElementsByTagName("button")[i].disabled = true;
    document.getElementsByClassName("spinner")[i].classList.remove("hidden");
    document.getElementsByClassName("button-text")[i].classList.add("hidden");
  } else {
    document.getElementsByTagName("button")[i].disabled = false;
    document.getElementsByClassName("spinner")[i].classList.add("hidden");
    document
      .getElementsByClassName("button-text")
      [i].classList.remove("hidden");
  }
}



































