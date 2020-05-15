import React, { Suspense } from "react";
import { Router } from "@reach/router";
import EcoNav from "./EcoNavigation";

import Home from "../pages/Home";
import Videos from "../pages/Videos";
import Concert from "../pages/Concert";
import Lessons from "../pages/Lessons";
import ConcertSuccess from "../pages/ConcertSuccess";
import ConcertFaild from "../pages/ConcertFaild";
import AccountUpdate from "../pages/AccountUpdate";

import "../css/normalize.scss";

const App = () => {
  return (
    <React.StrictMode>
      <Suspense fallback="loading">
        <header>
          <EcoNav
            links={[
              { name: "Home", url: "/" },
              { name: "Video Courses", url: "/videos" },
              { name: "Concert Tickets", url: "/concert" },
              { name: "Music Lessons", url: "/lessons" },
            ]}
          />
        </header>
        {
          // Routes for principal UI sections.
          // Concert Tickets Challenge: /concert
          // Online Video Purchase: /video
          // Online Lessons: /lessons
        }
        <Router>
          <Home path="/" />
          <Videos path="/videos" />
          <Concert path="/concert" />
          <ConcertSuccess path="/concert-success/:id" />
          <ConcertFaild path="/concert-faild/:id" />
          <Lessons path="/lessons" />
          <AccountUpdate path="/account-update/:id" />
        </Router>
      </Suspense>
    </React.StrictMode>
  );
};

export default App;
