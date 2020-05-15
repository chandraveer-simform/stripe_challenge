import React, { useState , useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { getPriceDollars } from "../components/Util";
import "../css/checkout.scss";
import { config } from "../components/mock_data";
import { concertSetup, concertSuccess } from "../Services/concert"; 
import { loadStripe} from '@stripe/stripe-js';

//Concert Ticket Component
/*
  This component works with i18n to show messages according to language coonfiguration (lang).
  The content of each message is located in public/locales/lang/translation.json
*/
const stripe =  loadStripe('pk_test_UFotfrDpP2sD8r2oxEasfn9m00ztbWZRMX'); 
// const stripePromise = loadStripe('pk_test_UFotfrDpP2sD8r2oxEasfn9m00ztbWZRMX');

const MIN_TIXX = 1; //min number of tickets user can buy
const MAX_TIXX = 10; //max number of tickets user can buy
 
const Concert = () => {

  const formatPrice = ({ amount, currency, tickets }) => {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    });
    const parts = numberFormat.formatToParts(amount);
    let zeroDecimalCurrency = true;
    for (let part of parts) {
      if (part.type === 'decimal') {
        zeroDecimalCurrency = false;
      }
    }
    amount = zeroDecimalCurrency ? amount : amount / 100;
    const total = (tickets * amount).toFixed(2);
    return numberFormat.format(total);
  };
   
  function reducer(state, action) {
    switch (action.type) {
      case 'useEffectUpdate':
      return {
        ...state,
        ...action.payload,
        price: formatPrice({
          amount: action.payload.basePrice,
          currency: action.payload.currency,
          quantity: state.quantity,
        }),
      };
      
      case 'setLoading':
        return { ...state, loading: action.payload.loading };
      case 'setError':
        return { ...state, error: action.payload.error };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    quantity: 1,
    price: null,
    loading: false,
    error: null,
    stripe: null,
  });

  const [tickets, setTickets] = useState(1); //number of tickets user want to buy
  const [total, setTotal] = useState("$0"); //total price to pay
  const [data, setData] = useState({});
  const t = useTranslation()[0];

  
  const increaseTicketCount = () => {
    if (tickets < MAX_TIXX) {
      setTickets(tickets + 1);
    }
  };

  const reduceTicketCount = () => {
    if (tickets > MIN_TIXX) {
      setTickets(tickets - 1);
    }
  };
  //Get info to load page, config API route in package.json "proxy"
  useEffect(() => {
    const setup = async () => {
      var result = await concertSetup();
      if (result === null) {
        //use static data
        //comment this code to work with backend only
        result = config;
      }
      setData(result);
    };
    setup();
  }, []);
  
 
  //Calculate total when number of tickets changes
  useEffect(() => {
    setTotal(getPriceDollars(tickets * data.basePrice, true));
  }, [data, tickets]);
  
  useEffect(() => {
    async function fetchConfig() {
      // Fetch config from our backend.
      const { publicKey, basePrice, currency } = await fetch(
        '/config'
      ).then((res) => res.json());
      // Make sure to call `loadStripe` outside of a component’s render to avoid
      // recreating the `Stripe` object on every render.
      dispatch({
        type: 'useEffectUpdate',
        payload: { basePrice, currency, stripe: await loadStripe(publicKey) },
      });
    }
    fetchConfig();
  }, []); 

  //  API Hit
  
  const fetchCheckoutSession = async ({ quantity }) => {
    return fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity,
      }),
    }).then((res) => res.json());
  };
  
  const handleClick = async (event) => {
    // Call your backend to create the Checkout session.
    dispatch({ type: 'setLoading', payload: { loading: true } });
    const { sessionId } = await fetchCheckoutSession({
      quantity: tickets,
    });

    // dispatch({ type: 'pushFunction' }) 
    // When the customer clicks on the button, redirect them to Checkout. 
    const { error } = await state.stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      dispatch({ type: 'setError', payload: { error } });
      dispatch({ type: 'setLoading', payload: { loading: false } });
    }
  };

    
  return (
    <main className="main-checkout"> 
      <div className="sr-root">
        <div className="sr-checkout-main">
          <section className="container">
            <div>
              <h1 id="headline">{t("headline")}</h1>
              <h2>{t("date")}</h2>
              <h4>{t("subline")}</h4>
              <div className="p-image">
                <img
                  src="/assets/img/kid.jpg"
                  width="640"
                  height="400"
                  alt=""
                />
              </div>
            </div>
            <div className="tickets-setter" style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}>
              <button
                disabled={tickets <= 1}
                className="increment-btn"
                id="subtract"
                onClick={() => reduceTicketCount()}
              >
                -
              </button>
              <input
                type="number"
                id="tickets-input"
                min="1"
                max="10"
                value={tickets}
                disabled
                style={{textAlign:'center', marginLeft: '10px', marginRight: '10px'}}
              />
              <button
                disabled={tickets >= 10}
                className="increment-btn"
                id="add"
                onClick={() => increaseTicketCount()}
              >
                +
              </button>
            </div>
            <p className="sr-legal-text">{t("sr-legal-text")}</p>
            <button className="button" role="link"  id="submit" onClick={handleClick}>
              {t("button.submit", { total: total })} 
            </button>
          </section>
          <div id="error-message"></div>
        </div>
      </div> 
    </main>
  );
};

export default Concert;
