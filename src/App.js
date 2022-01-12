import React from "react";
import Home from "./Home";
import Board from "./Board";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route exact path="/game/:gameId" element={<Board></Board>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
