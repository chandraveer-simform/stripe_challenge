var getPriceDollars = (price, decimal = false, recurringBy = undefined) => {
  if (decimal) {
    price = Math.round(price / 100.0).toFixed(2);
  } else {
    price = Math.round(price / 100.0);
  }
  var pricePart = "$" + price;
  if (recurringBy === undefined) {
    return pricePart;
  } else {
    return pricePart + "/" + recurringBy;
  }
};

var capitalize = (itemName) => {
  return itemName.charAt(0).toUpperCase() + itemName.slice(1);
};
//Toggles a spinner
var changeLoadingState = function (isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

exports.getPriceDollars = getPriceDollars;
exports.capitalize = capitalize;
exports.changeLoadingState = changeLoadingState;
