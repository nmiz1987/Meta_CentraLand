import "./UpdateLandInfo.css";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const UpdateLand = () => {
  const params = useParams();
  const [landFromDB, setLandFromDB] = useState({});
  const [message, setMessage] = useState("");
  const [forSale, setForSale] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newGame, setNewGame] = useState("");
  const [id] = useState(params.id);

  async function fetchLandFromDB() {
    const res = await fetch(`/api/lands/${id}`);
    const json = await res.json();
    try {
      if (json) {
        setLandFromDB(json);
        setNewPrice(landFromDB.price);
        setNewGame(landFromDB.game);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function updateLand() {
    if (forSale.length === 0) {
      setMessage("You must choose if the land is for sale!");
      return;
    }
    if (Number(newPrice) < 0) {
      setMessage("The price must be between greater than 0!");
      return;
    }
    if (isNaN(Number(newPrice))) {
      setNewPrice(landFromDB.price);
    }

    setMessage("");
    try {
      const res = await fetch(`/api/lands/updateLand/${id}`, {
        method: "put",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          forSale: forSale === "Yes" ? true : false,
          price: newPrice || landFromDB.price,
          game: newGame === undefined ? landFromDB.game : newGame,
        }),
      });
      const json = await res.json();
      console.log("updateLand", json);
      setMessage(
        "Land info updated successfully 👍, You can go back to the Lands"
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    fetchLandFromDB();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!localStorage.getItem("user")) {
    return <Navigate to="/log-in" />;
  } else
    return (
      <div className="wrapper">
        <div className="title-landInfo">
          <h2>
            <u>Land Information</u>
          </h2>
        </div>
        <Link id="cancel" to={`/land/${id}`}>
          Cancel
        </Link>
        <div className="content">
          <div>
            <u>
              <strong>Owner:</strong>
            </u>{" "}
            {landFromDB.owner}
          </div>
          <div>
            <u>
              <strong>type of land:</strong>
            </u>{" "}
            {landFromDB.type}
          </div>
          <div>
            <u>
              <strong>Is for sale:</strong>
            </u>{" "}
            <select id="forSale" onChange={(e) => setForSale(e.target.value)}>
              <option />
              <option id="true">Yes</option>
              <option key="false">No</option>
            </select>
          </div>
          <div>
            <u>
              <strong>Land price:</strong>
            </u>{" "}
            <input
              type="number"
              id="price"
              defaultValue={landFromDB.price}
              min="15"
              max="200"
              onChange={(e) => setNewPrice(e.target.value)}
            />
            $
          </div>
          <div>
            <u>
              <strong>Link to a game:</strong>
            </u>{" "}
            <input
              defaultValue={landFromDB.game}
              id="game"
              onChange={(e) => setNewGame(e.target.value)}
            />
          </div>
        </div>
        <div className="bottom">
          <button onClick={updateLand}>Update</button>
          <p className="message">{message}</p>
        </div>
      </div>
    );
};

export default UpdateLand;
