import React,{useState} from "react";
import { Link } from "@reach/router"; 
import axios from 'axios';
// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
 

// Custom Components 
import CardInput from "./CardInput";

//Payment Form, process user information to allow payment.


 
const PaymentForm = (props) => {
  // State
 
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [pId, setPId] = useState('')
  const [thankYou, setThankYou] = useState(true)
  
  const { active } = props;
  const {amount} =props;
  const stripe = useStripe();
  const elements = useElements(); 

  // console.log("amount",props.amount)
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }  
 
    const res = await axios.post('http://localhost:4242/pay',{amount: amount, email:email });
    const clientSecret = res.data['client_secret']; 
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement), 
        billing_details: { 
          email: email,
          name: name
        }, 
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Money is in the bank!');
        setPId(result.paymentIntent.id)
        setThankYou(false)

        // alert("Transection succeeded")
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };
  
  return (
    <div> 
      <form
        onSubmit={handleSubmit}
        id="payment-form"
        className={`sr-payment-form payment-view ${active ? "" : "hidden"} ${thankYou ? '' : 'hidden'}`}
      >
        <h3>Payment details</h3>
        <div className="sr-form-row">
          <div className="sr-combo-inputs">
            <div className="sr-combo-inputs-row">
              <input
                type="text"
                id="name"
                placeholder="Name"
                autoComplete="cardholder"
                className="sr-input"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="sr-combo-inputs-row">
              <input
                type="text"
                id="email"
                placeholder="Email"
                autoComplete="cardholder"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="sr-combo-inputs-row">
              <div id="card-element" className="sr-input sr-card-element">  
                  <CardInput />  
              </div>
            </div>
          </div>
          <div className="sr-field-error" id="name-errors" role="alert"></div>
          <div className="sr-field-error" id="email-errors" role="alert"></div>
          <div className="sr-field-error" id="card-errors" role="alert"></div>
        </div>
        <button id="" type="submit">
          <div className="spinner hidden" id="spinner"></div>
          <span id="button-text hidden">Purchase</span>
        </button> 
        
        <div className="sr-legal-text">
          Your card will be immediately charged
        </div>
      </form>
      <div className={`sr-section completed-view ${thankYou ? 'hidden' : ''}`}>
        <h3 id="order-status">Thank you for your order!</h3>
        <p>
          Payment Id: <span id="payment-id">{pId}</span>
        </p>
        <p>Please check your email for download instructions.</p>
        <button onClick={() => window.location.reload(false)}>Place Another Order</button> 
         
      </div> 
    </div>
  );
};

export default PaymentForm;
