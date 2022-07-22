import "./BuyLand.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../UserContext";
import { Link, Navigate } from "react-router-dom";

const LandInfo = (land) => {
  const params = useParams();
  const [landFromDB, setLandFromDB] = useState({});
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [landId] = useState(params.id);
  const [message, setMessage] = useState("");
  const [hideButtons, setHideButtons] = useState(false);

  // fetch new information to verify the user has the money
  async function fetchUserFromDB() {
    try {
      const res = await fetch(`/api/users/${localStorage.getItem("user")}`);
      const json = await res.json();

      if (json) {
        setCurrentUser(json);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // fetch new information to verify the land price and owners
  async function fetchLandFromDB() {
    const res = await fetch(`/api/lands/${landId}`);
    const json = await res.json();
    try {
      if (json) {
        setLandFromDB(json);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function buyLand() {
    // some extra validation
    if (landFromDB.type !== "Real Estate") {
      setMessage("This Land is not Real Estate");
      return;
    }
    if (landFromDB.forSale !== true) {
      setMessage("This Land is not for sale");
      return;
    }

    try {
      const resMoney = await fetch(
        `/api/users/buyLand/${currentUser.id}/${landFromDB.ownerID}/${landFromDB.price}`,
        {
          method: "put",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            buyer: currentUser.id,
            seller: landFromDB.ownerID,
          }),
        }
      );

      const jsonMoney = await resMoney.json();
      setCurrentUser(jsonMoney);
      // ##########  change land owners ##########
      const resLand = await fetch(`/api/lands/buyLand/${landId}`, {
        method: "put",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          owner: currentUser.fullName,
          ownerID: currentUser.id,
        }),
      });
      const jsonLand = await resLand.json();
      console.log("new land info:", jsonLand);
      setMessage("Congratulations on buying this land 👌");
      setHideButtons(true);
      localStorage.setItem("BuyLand", true);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    fetchUserFromDB();
    fetchLandFromDB();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!localStorage.getItem("user")) {
    return <Navigate to="/log-in" />;
  } else
    return (
      <div className="wrapper">
        <div className="title-BuyLand">
          <h2>
            <u>Buy This Land</u>
          </h2>
        </div>
        <div className="content">
          <div>
            <u>
              <strong>This land costs:</strong>
            </u>{" "}
            {landFromDB.price}
          </div>
          <div>
            <u>
              <strong>You have in your account:</strong>
            </u>{" "}
            {currentUser.money}
          </div>
          {!localStorage.getItem("BuyLand") &&
            (hideButtons === false ? (
              currentUser.money >= landFromDB.price ? (
                <div className="user-have-money">
                  <strong>
                    <h3>Are you sure you want to buy this land?</h3>
                  </strong>
                  <div className="link-buy-land">
                    <div className="buy-yes" onClick={buyLand}>
                      YES! 👌
                    </div>
                    <Link className="buy-no" to={`/land`}>
                      No 😒
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="user-has-no-money">
                  <h3>Sorry, you don't have enough money to buy this land.</h3>
                </div>
              )
            ) : (
              <div></div>
            ))}
        </div>
        <div className="bottom">
          <p className="message">{message}</p>
        </div>
      </div>
    );
};

export default LandInfo;
