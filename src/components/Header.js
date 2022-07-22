import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import { useContext, useEffect } from "react";

const Header = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const name = "Final Project - Meta CentraLand";
  const author = "Netanel Mizrahi";

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

  useEffect(() => {
    if (localStorage.getItem("user")) fetchUserFromDB();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="header">
      <ul className="header-links">
        <div></div>
        {currentUser.fullName ? (
          <li>
            Hello {currentUser.fullName}! You have {currentUser.money}$ in your
            account
          </li>
        ) : (
          <>
            <li>
              <Link to="/log-in">Log in</Link>
            </li>
            <li>
              <Link to="/sing-up">Sing up</Link>
            </li>
          </>
        )}
        <li>
          {localStorage.getItem("user") ? (
            <Link to="/land">🏠</Link>
          ) : (
            <Link to="/">🏠</Link>
          )}

          {localStorage.getItem("user") && (
            <Link to="/log-in" id="sing-out">
              Sing-Out
            </Link>
          )}
        </li>
      </ul>
      <h1 className="title">{name}</h1>
      <h1 className="creator">Created By: {author}</h1>
    </div>
  );
};

export default Header;
