import React from "react";
import ReactHtmlParser from "react-html-parser";
import { capitalize, getPriceDollars } from "./Util";

//Generate HTML for video course
const SREItem = (props) => {
  const { id, index, item, price, img, desc, action, selected } = props;

  return (
    <div className={`sr-item ${selected ? " selected" : ""}`}>
      <div className="sr-item-text">{capitalize(item)}</div>

      <div className="eco-desc-text">{ReactHtmlParser(desc)}</div>

      <div className="eco-product-img">
        <img src={img} alt={item} />
      </div>

      <button2
        id={id}
        className={`${selected ? " selected" : ""}`}
        onClick={() => action(id, index)}
      >
        <span id="button-text">{getPriceDollars(price)}</span>
      </button2>
    </div>
  );
};
export default SREItem;
