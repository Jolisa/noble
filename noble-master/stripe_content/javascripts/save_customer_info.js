// A reference to Stripe.js




(async () => {
  'use strict';

  let stripe;
  let purchase;
  //var signupForm = document.getElementById("payment-form");
  var paymentForm = document.getElementById("payment-form");
  var verifyForm = document.getElementById("verify-form");
  const config = await store.getConfig();


  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  fetch("/config")
    .then(function(result) {
      return result.json();
    })
    .then(async function(data) {
      stripe = Stripe(data.publishableKey);
      purchase = data.purchase;
      // Show formatted price information.
      const price = (purchase.amount / 100).toFixed(2);
      const numberFormat = new Intl.NumberFormat(["en-US"], {
        style: "currency",
        currency: purchase.currency,
        currencyDisplay: "symbol"
      });

      const submitButton = paymentForm.querySelector('button[type=submit]');
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


        const card = elements.create('card', {style, hidePostalCode: true});

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
          // Re-enable the Pay button.
          //submitButton.disabled = false;
        });

      /*document.getElementById("order-amount").innerText = numberFormat.format(
        price
      );*/
      // Format phone number input field
      const phoneInputField = document.querySelector("#phone");
      const phoneInput = window.intlTelInput(phoneInputField, {
        separateDialCode: true,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.11/js/utils.js"
      });


      // Create the payment request (apparently required to generate the form).
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

  // Callback when a payment method is created.
  /*paymentRequest.on('paymentmethod', async (event) => {
    // Confirm the PaymentIntent with the payment method returned from the payment request.
    const {error} = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: event.paymentMethod.id,
        shipping: {
          name: event.shippingAddress.recipient,
          phone: event.shippingAddress.phone,
          address: {
            line1: event.shippingAddress.addressLine[0],
            city: event.shippingAddress.city,
            postal_code: event.shippingAddress.postalCode,
            state: event.shippingAddress.region,
            country: event.shippingAddress.country,
          },
        },
      },
      {handleActions: false}
    );
    if (error) {
      // Report to the browser that the payment failed.
      event.complete('fail');
      handlePayment({error});
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      console.log("we did a thing");
      //event.complete('success');
      // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
      /*const response = await stripe.confirmCardPayment(
        paymentIntent.client_secret
      );
      handlePayment(response);
    }
  });*/

  // Callback when the shipping address is updated.
 /** paymentRequest.on('shippingaddresschange', (event) => {
    event.updateWith({status: 'success'});
  });

  // Callback when the shipping option is changed.
  paymentRequest.on('shippingoptionchange', async (event) => {
    // Update the PaymentIntent to reflect the shipping cost.
    const response = await store.updatePaymentIntentWithShippingCost(
      paymentIntent.id,
      store.getLineItems(),
      event.shippingOption
    );
    event.updateWith({
      total: {
        label: 'Total',
        amount: response.paymentIntent.amount,
      },
      status: 'success',
    });
    const amount = store.formatPrice(
      response.paymentIntent.amount,
      config.currency
    );
    //updateSubmitButtonPayText(`Pay ${amount}`);
  });*/


      // Handle signup form submission.
      //signupForm.addEventListener("submit", async event => {
      /*paymentForm.addEventListener("submit", async event => {
        event.preventDefault();
        if (!phoneInput.isValidNumber()) {
          // Invlaid phone number, return error message, abort
          console.log(phoneInput);
          phoneInputField.setCustomValidity("Invalid phone number!");
          signupForm.reportValidity();
          setTimeout(function() {
            phoneInputField.setCustomValidity("");
          }, 4000);
          return;
        }
        console.log("we did find the correct function on submit button click");
        changeLoadingState(true, 0);
        // Create Customer
        const { checkoutSession, error } = await createCustomer({
          phone: phoneInput.getNumber()
        });
        if (error) {
          alert(error.message);
          changeLoadingState(false, 0);
          return;
        }
        // Recirect to Checkout
        await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
      });*/

      // Check if customer is returning from Checkout
      const url = new URL(window.location.href);
      const session_id = url.searchParams.get("session_id");
      if (session_id) {
        //document.getElementById("signup-view").classList.add("hidden");
        //document.getElementById("payment-view").classList.remove("hidden");

        const { checkoutSession } = await fetch(
          `checkout-session/${session_id}`
        ).then(res => res.json());

        if (checkoutSession) {
          // Store customer details in localStorage
          localStorage.setItem(
            "customer",
            JSON.stringify({
              id: checkoutSession.customer.id,
              email: checkoutSession.customer.email,
              last4: checkoutSession.setup_intent.payment_method.card.last4
            })
          );
          window.location.replace("/");
        }
      }

      // Check if customer has been remembered
      const rememberedCustomer = JSON.parse(localStorage.getItem("customer"));
      if (rememberedCustomer) {
        document.getElementsByClassName(
          "button-text"
        )[1].innerText = `Pay with card ending in ${rememberedCustomer.last4}`;
        document.getElementById("customer-email").innerText =
          rememberedCustomer.email;

        document.getElementById("forget-me").addEventListener("click", e => {
          localStorage.removeItem("customer");
        });

        paymentForm.addEventListener("submit", async event => {
          event.preventDefault();
          changeLoadingState(true, 1);
          const verificationResponse = await fetch("/start-twilio-verify", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerId: rememberedCustomer.id })
          }).then(res => res.json());

          if (verificationResponse.status === "pending") {
            document.getElementById("payment-view").classList.add("hidden");
            document.getElementById("verify-view").classList.remove("hidden");

            verifyForm.addEventListener("submit", async event => {
              event.preventDefault();
              changeLoadingState(true, 2);

              const { error, paymentIntent } = await fetch(
                "/check-twilio-verify",
payment                {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    customerId: rememberedCustomer.id,
                    code: document.getElementById("verify-code").value,
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
                }
              }
            });
          }
        });
      }
    });

  async function createCustomer({ phone }) {
    return await fetch("/create-customer", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone,
        email: document.querySelector("#email").value
      })
    }).then(res => res.json());
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
    changeLoadingState(false, 2);
    const errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
      errorMsg.textContent = "";
    }, 4000);
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
}
