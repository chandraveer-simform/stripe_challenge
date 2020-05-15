import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import "../css/lessons.scss";
import { accountUpdate } from "../Services/account";

//Component responsable to update user's info.
const AccountUpdate = ({ id }) => {
  const [data, setData] = useState({});

  //Get info to load page, User payment information, config API route in package.json "proxy"
  useEffect(() => {
    const setup = async () => {
      const result = accountUpdate(id);
      if (result !== null) {
        setData(result);
      }
    };
    setup();
  }, [id]);

  return (
    <div className="sr-body">
      <div className="eco-items" id="account-information">
        {
          //User's info shoul be display here
        }
        <h3>Current Account Information</h3>
        <h4>We have the following card information on file for you: </h4>
        <p className="eco-banner-text">
          Billing Email:&nbsp;&nbsp;<span id="billing-email"></span>
          <br />
          Card Exp Month:&nbsp;&nbsp;<span id="card-exp-month"></span>
          <br />
          Card Exp Year:&nbsp;&nbsp;<span id="card-exp-year"></span>
          <br />
          Card last 4:&nbsp;&nbsp;<span id="card-last4"></span>
          <br />
        </p>
      </div>
      <div className="sr-main">
        <div className="sr-payment-form payment-view">
          <h3>Update your Payment details</h3>
          <p>Fill out the form below if you'd like to us to use a new card. </p>
          <div className="sr-form-row">
            <div className="sr-combo-inputs">
              <div className="sr-combo-inputs-row">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  autocomplete="cardholder"
                  className="sr-input"
                />
              </div>
              <div className="sr-combo-inputs-row">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  autocomplete="cardholder"
                />
              </div>
              <div className="sr-combo-inputs-row">
                <div className="sr-input sr-card-element"></div>
              </div>
            </div>
            <div className="sr-field-error" id="card-errors" role="alert"></div>
            <div
              className="sr-field-error"
              id="customer-exists-error"
              role="alert"
              hidden
            ></div>
          </div>
          <button id="submit" disabled>
            <div className="spinner hidden" id="spinner"></div>
            <span id="button-text">Register</span>
          </button>
          <div className="sr-legal-text">
            Your card will not be charged. By registering, you hold a session
            slot which we will confirm within 24 hrs.
          </div>
        </div>

        <div className="sr-section hidden completed-view">
          <h3 id="signup-status">Payment Information updated </h3>
          <Link to="/lesson-signup">
            <button>Sign up for lessons under a different email address</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountUpdate;
