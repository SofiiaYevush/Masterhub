import React from "react";
import "./Home.scss";
import HomeUnregistered from "./HomeUnregistered";
import HomeRegistered from "./HomeRegistered";
import getCurrentUser from "../../utils/getCurrentUser";

function Home() {
  const currentUser = getCurrentUser();

  return (
    <div className="home">
      {!currentUser ? <HomeUnregistered /> : <HomeRegistered />}
    </div>
  );
}

export default Home;
