import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Headers from "./components/Header";
import LogIn from "./components/LogIn/LogIn";
import Registration from "./components/Registration/Registration";
import Land from "./components/Lands/Lands";
import LandInfo from "./components/LandInfo/LandInfo";
import BuyLand from "./components/BuyLand/BuyLand";
import UpdateLand from "./components/UpdateLandInfo/UpdateLandInfo";
import UserContext from "./UserContext";
import Welcome from "./components/Welcome/Welcome";
import { useState } from "react";

function App() {
  const currentUser = useState({});
  return (
    <UserContext.Provider value={currentUser}>
      <div className="App">
        <BrowserRouter>
          <Headers />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/land" element={<Land />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sing-up" element={<Registration />} />
            <Route path="/land/:id" element={<LandInfo />} />
            <Route path="/buy-land/:id" element={<BuyLand />} />
            <Route path="/updateLand/:id" element={<UpdateLand />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
