import { useState } from "react";
import "./Registration.css";

const Registration = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Player");
  const [messageSingUp, setMessageSingUp] = useState("");
  const [messageLogIn, setMessageLogIn] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");

  const roles = ["Player", "Buyer"];

  const registrationUser = async () => {
    setMessageSingUp("");
    setAdminMessage("");
    let newUser;
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          fullName: fullName,
          userName: userName,
          password: password,
          role: role,
        }),
      });
      if (res.status === 409) {
        setMessageSingUp(
          `User Name '${userName}' is already in the system! Please try again...`
        );
      } else {
        newUser = await res.json();
        setMessageSingUp(`New user ${newUser.userName} successfully created`);
        // when creating user with full name "admin" and all Meta CentraLand deleted and created new
        if (newUser.fullName === "admin") {
          // it takes time until the data saved to newUser, so there is 1 sed for deletion and 5 seconds to creation
          setTimeout(() => deleteCurrentMetaCentraLand(), 1000);
          setTimeout(() => createPrimalLand(), 5000);
          setMessageSingUp(
            `You are now creating the new Meta CentraLand, WAIT for the Confirmation ⬇️`
          );
        }
        setMessageLogIn(true);
      }
    } catch (err) {
      setMessageSingUp(err.message);
    }

    const deleteCurrentMetaCentraLand = async () => {
      try {
        // Delete current Meta CentraLand
        await fetch(`/api/lands/`, {
          method: "DELETE",
        });
      } catch (err) {
        setMessageSingUp(err.message);
      }
    };

    // Creating new Meta CentraLand
    const createPrimalLand = async () => {
      try {
        const res = await fetch(`/api/lands/createAllLand/${newUser.id}`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            fullName: newUser.fullName,
          }),
        });
        const json = await res.json();
        console.log(json);
        setAdminMessage(
          json.message + ". You can now enter the Meta CentraLand 👍"
        );
      } catch (err) {
        setMessageSingUp(err.message);
      }
    };
  };

  return (
    <div className="singUp-wrapper">
      <div className="title-singUp">
        <h2>Enter your information:</h2>
      </div>
      <form
        className="singUp-wrapper"
        onSubmit={(e) => {
          e.preventDefault();
          registrationUser();
        }}
      >
        <label htmlFor="fullName">
          Full Name:
          <input
            id="fullName"
            value={fullName}
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
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
        <label htmlFor="password">
          Role:
          <select
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <div className="bottom-singUp">
          <button>Sing Up</button>
          <p className="message">{messageSingUp}</p>
          <p className="adminMessage">{adminMessage}</p>
          {messageSingUp.length > 0 && messageLogIn === true && (
            <p>
              You can now log in, please click <a href="/log-in">here</a> to Log
              In.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Registration;
