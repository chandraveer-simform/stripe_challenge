import React,{useState} from "react";
import { Link } from "@reach/router";

import axios from 'axios'
import CardInput from "../components/CardInput"
//Registration Form Component, process user info for online session.
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

  // console.log("amount",props.amount)


const RegistrationForm = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [customer_id,  setCustomer_id] = useState('')
  const [thankYou, setThankYou] = useState(true)

  const { selected, details } = props;
  const stripe = useStripe();
  const elements = useElements(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }  
 
    const res = await axios.get('http://localhost:4242/schedule-lesson');
    setCustomer_id(res.data['customer_id']);
    const clientSecret = res.data['client_secret']; 
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
          email: email
        },
      }
    });

    if (result.error) {
      // Display result.error.message in your UI.
    } else { 
      setThankYou(false)
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
    }
  };

  return (
    <div className="sr-main">
      <div
        className={`sr-payment-form payment-view ${
          selected === -1 ? "hidden" : ""
        } ${thankYou ? '' : 'hidden'}`}
      >
        <h3>Registration details</h3>
        <div id="summary-table" className="summary-table">
          <font color="red">{details}</font>
        </div>
        <div className="sr-form-row">
          <div className="sr-combo-inputs">
            <div className="sr-combo-inputs-row">
              <input
                type="text"
                id="name"
                placeholder="Name"
                autoComplete="cardholder"
                className="sr-input"
                onChange={e=>setName(e.target.value)}
              />
            </div>
            <div className="sr-combo-inputs-row">
              <input
                type="text"
                id="email"
                placeholder="Email"
                autoComplete="cardholder"
                onChange={e=>setEmail(e.target.value)}
              />
            </div>
            <div className="sr-combo-inputs-row">
              <div className="sr-input sr-card-element"><CardInput /></div>
            </div>
          </div>
          <div className="sr-field-error" id="card-errors" role="alert"></div>
          <div
            className="sr-field-error"
            id="customer-exists-error"
            role="alert"
            hidden
          >
            A customer with the email address of {customer_id}
            <span id="error_msg_customer_email"></span> already exists. If you'd
            like to update the card on file, please visit
            <span id="account_link"></span>.
          </div>
        </div>
        <button id="submit" onClick={handleSubmit}>
          <div className="spinner hidden" id="spinner"></div>
          <span id="button-text">Request Lesson</span>
        </button>
        <div className="sr-legal-text">
          Your card will not be charged. By registering, you hold a session slot
          which we will confirm within 24 hrs.
        </div>
      </div>

      <div className={`sr-section completed-view ${thankYou ? 'hidden' : ''}`}>
        <h3 id="signup-status">
          Woohoo! They are going to call you the .{name}
        </h3>
        <p>
          We've created a customer account with an id of{}
          <span id="customer-id"></span> and saved the card ending in{" "}
          <span id="last4"></span>
        </p>
        <p>
      Please check your email at <span id="customer_email">{email}</span> for a
          welcome letter.
        </p>
        <Link to="/lessons">
          <button>Sign up again under a different email address</button>
        </Link>
      </div>
    </div>
  );
};
export default RegistrationForm;
