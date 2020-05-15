import React from "react";
import SRECard from "../components/SRECard";
import "../css/global.scss";
//Show home page
const Home = () => {
  return (
    <main className="main-global">
      <div className="sr-title" id="title">
        <h2>Card Payments Certification Challenge</h2>
      </div>

      <div className="sr-instructions">
        Pick one or more sections to complete.
      </div>

      <div className="sr-body">
        <div id="sr-items" className="items">
          <SRECard
            id="videos"
            title="Video Course"
            desc="Build a card payment integration using the Payment Intents API and Stripe Elements"
            img="/assets/img/music-sheet2.jpeg"
            route="/videos"
          />
          <SRECard
            id="concert"
            title="Concert Tickets"
            desc="Build a global Checkout (server + client) integration to accept
        online payments"
            img="/assets/img/kid.jpg"
            route="/concert"
          />
          <SRECard
            id="lessons"
            title="Music Lessons"
            desc="Build an off-session integration using the Setup Intents API and
        Stripe Elements"
            img="/assets/img/drums2.jpeg"
            route="/lessons"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
