import "./Land.css";
import { useEffect, useState } from "react";
import OneLand from "../OneLand/OneLand";
import { Navigate } from "react-router-dom";
import Map from "../Map/Map";

const Lands = () => {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    requestsLands();
    localStorage.removeItem("BuyLand");
  }, []);

  async function requestsLands() {
    const res = await fetch("api/lands");
    const json = await res.json();
    setLands(json);
  }

  if (!localStorage.getItem("user")) {
    return <Navigate to="/log-in" />;
  } else
    return (
      <div className="allLand">
        <Map />
        {!lands.length ? (
          <h1>Loading...</h1>
        ) : (
          lands.map((land, index) => <OneLand key={index} info={land} />)
        )}
      </div>
    );
};

export default Lands;
