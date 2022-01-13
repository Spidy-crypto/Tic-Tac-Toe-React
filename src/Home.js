import React, { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [size, setSize] = useState(0);
  const [games, setGames] = useState([]);
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  const joinLink = () => {
    if (link) {
      let url = link.split("/");
      let gameId = url[4];
      fetch("http://localhost:8080/joinGame/" + gameId + "/" + 2, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            navigate("/game/" + gameId);
          }
        });
    }
  };

  const createClick = () => {
    if (size) {
      fetch("http://localhost:8080/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1Id: 1, size: size }),
      })
        .then((res) => res.json())
        .then((data) => navigate("/game/" + data.gameId));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user") == null) {
      localStorage.setItem("user", 1);
    }
    fetch("http://localhost:8080/getGames/" + 1)
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      <div id="input">
        <input
          type="text"
          name="size"
          id="size"
          placeholder="Enter Size between 3 to 9"
          onChange={(e) => setSize(e.target.value)}
        />
        <button className="button is-primary" onClick={() => createClick()}>
          Create Game
        </button>

        <input
          type="text"
          name="size"
          id="size"
          placeholder="Enter Link"
          onChange={(e) => setLink(e.target.value)}
          style={{ marginLeft: "10%" }}
        />
        <button className="button is-primary" onClick={() => joinLink()}>
          Join Game
        </button>
      </div>

      <table style={{ marginTop: "5%" }}>
        <thead>
          <th>GameId</th>
          <th>user1Id</th>
          <th>user2Id</th>
          <th>size</th>
          <th>status</th>
        </thead>
        <tbody>
          {games &&
            games.map((game) => {
              return (
                <tr
                  onClick={() =>
                    navigate("/game/" + game.gameId, { state: game })
                  }
                >
                  <td>{game.gameId}</td>
                  <td>{game.user1Id}</td>
                  <td>{game.user2Id}</td>
                  <td>{game.size}</td>
                  <td>{game.status}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
