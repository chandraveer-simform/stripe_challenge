import React, { useState } from "react";
import { capitalize, getPriceDollars } from "./Util";
import PaymentForm from "./PaymentForm";

// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_UFotfrDpP2sD8r2oxEasfn9m00ztbWZRMX");

const SummaryTable = (props) => {
  const { discountFactor, minItemsForDiscount, items, order } = props;
  var itemdata;
  console.log("Item",props.items)

  //Return array of selected items
  var getSelectedItems = () => {
    return items.filter((item) => item.selected);
  };

  //Calculate total before applying discount
  var computeSubTotal = () => {
    return getSelectedItems(items)
      .map((item) => item.price)
      .reduce((item1, item2) => item1 + item2, 0);
  };

  //Check if discount apply to order
  var computeDiscountPercentage = () => {
    return minItemsForDiscount <= order.length ? discountFactor : 0;
  };
  //Calculate total discount
  var computeDiscount = () => {
    return computeSubTotal() * computeDiscountPercentage();
  };
  //Calculate total after discount
  var computeTotal = () => {
    let subTotal = computeSubTotal();
    let discount = computeDiscount();
    var amount = subTotal - discount;
    return amount;
  };
  //Generate order summary HTML
  var buildOrderSummary = (rowClass, desc, amountCents) => {
    return (
      <div className="summary-row">
        <div className={`${rowClass} summary-title`}>{capitalize(desc)}</div>
        <div className={`${rowClass} summary-price`}>
          {getPriceDollars(amountCents)}
        </div>
      </div>
    );
  };

  const selectedItems = getSelectedItems();
  const discount = computeDiscount();
  const subTotal = computeSubTotal();
  const active = order.length > 0; 
  return (
    <div className="sr-main">
      <div className="sr-summary">
        <h3>Purchase Summary</h3>
        <div
          id="summary-preface"
          className={`sr-legal-text left ${active ? "hidden" : ""}`}
        >
          No courses selected.
        </div>
        <div
          id="summary-table"
          className={`summary-table  ${active ? "" : "hidden"}`}
        >
          {itemdata= selectedItems.map((item) =>
            buildOrderSummary("summary-product", item.title, item.price)
          )}
          {discount > 0
            ? buildOrderSummary("summary-discount", "Discount", discount)
            : ""}

          {discount > 0
            ? buildOrderSummary("summary-subtotal", "Subtotal", subTotal)
            : ""}
          {buildOrderSummary("summary-total", "Total", computeTotal())}
        </div> 
      </div> 
        
      {
        //Component to generate payment form
      }
      <Elements stripe={stripePromise}>
        <PaymentForm active={active} amount={computeTotal()} products={itemdata}/>
      </Elements>
      
    </div>
  );
};

export default SummaryTable;
