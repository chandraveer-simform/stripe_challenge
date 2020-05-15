import React, { useState, useEffect } from "react";
import "../css/checkout.scss";
import { Link } from "@reach/router";
 

//Component to show success after buying concert tickets
const ConcertFaild = (props) => {
  return (
    <main className="main-checkout">
      <div className="sr-root">
        <div className="sr-main">
          <header className="sr-header"></header>
          <div className="sr-payment-summary completed-view">
            <h1>Your payment Faild</h1>
            <h4>View CheckoutSession response:</h4>
          </div>
          <div className="sr-section completed-view">
            <div className="eco-callout">
              {
                //your information will be display here
              }
               
            </div>
            <Link to="/concert">
              <button>Return to ticket purchase</button>
            </Link>
          </div>
        </div>
        <div className="sr-content">
          <div className="pasha-image-stack">
            <span>
              <img
                src="/assets/img/drums2.jpeg"
                width="275"
                height="185"
                alt=""
              />
            </span>
            <span>
              <img
                src="/assets/img/guitar.jpg"
                width="275"
                height="185"
                alt=""
              />
            </span>
            <span>
              <img
                src="/assets/img/music-sheet2.jpeg"
                width="275"
                height="185"
                alt=""
              />
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConcertFaild;
