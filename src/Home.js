import React, { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [size, setSize] = useState(0);
  const navigate = useNavigate();
  const createClick = () => {
    fetch("http://localhost:8080/createGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user1Id: 35, size: size }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div>
      {/* <div id="modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div
            className="box"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p id="result"></p>
            <button className="button is-primary" onClick="location.reload()">
              Start Again
            </button>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onclick="modal_close()"
          aria-label="close"
        ></button>
      </div> */}

      <h1>Tic Tac Toe</h1>

      <p id="turn">Enter Size</p>

      <div id="input">
        <input
          type="text"
          name="size"
          id="size"
          placeholder="Enter Size between 3 to 9"
          onChange={(e) => setSize(e.target.value)}
        />
        <button className="button is-primary" onClick={() => createClick()}>
          Create
        </button>
      </div>
    </div>
  );
}

export default Home;
