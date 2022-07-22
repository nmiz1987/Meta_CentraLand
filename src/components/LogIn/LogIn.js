import "./LogIn.css";
import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../UserContext";

const LogIn = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);

  // when enter to log-in page clear current user
  useEffect(() => {
    setCurrentUser({});
    localStorage.removeItem("user");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkIfUserInDB() {
    const res = await fetch(`/api/users/${userName}/${password}`);
    const json = await res.json();
    try {
      if (json.userName) {
        localStorage.setItem("user", json.id); // uses for when the user refresh the page (keep him in the system)
        setCurrentUser(json); // uses for passing information between components
      }
    } catch (err) {
      setMessage(`User and Password doesn't in the system!`);
    }
  }

  useEffect(() => {
    if (currentUser.userName) {
      setRedirect(true);
    }
  }, [redirect, currentUser]);

  if (currentUser.fullName) {
    // if use connected to the system
    return <Navigate to="/land" />;
  } else
    return (
      <div className="login-wrapper">
        <div className="title-login">
          <h2>Enter your information:</h2>
        </div>
        <form
          className="login-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
            checkIfUserInDB();
          }}
        >
          <label htmlFor="userName">
            User Name:
            <input
              id="userName"
              value={userName}
              placeholder="User Name"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              id="password"
              value={password}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="bottom">
            <button>Log In</button>
            <p className="err-message">{message}</p>
          </div>
        </form>
      </div>
    );
};

export default LogIn;
