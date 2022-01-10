import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/webSocket";

var socket = new SockJS(SOCKET_URL);
let stompClient = Stomp.over(socket);
function Board(props) {
  // const { gameId } = useParams();
  //websocket conection

  const [size, setSize] = useState(0);
  const [moves, setMoves] = useState([]);
  const [board, setBoard] = useState([[]]);
  const [isDisabled, setDisabled] = useState(false);

  if (!stompClient.connected) {
    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/move", (data) => {
        changeMove(JSON.parse(data.body));
      });
    });
  }

  let cell = 0;
  useEffect(() => {
    fetch("http://localhost:8080/game/35")
      .then((res) => res.json())
      .then((data) => {
        setSize(data.size);
        setMoves(data.movesDtoList);
      });
  }, []);

  useEffect(() => {
    let rows = [];
    for (let i = 0; i < size; i++) {
      let cols = [];
      for (let j = 0; j < size; j++) {
        cols.push(" ");
      }
      rows.push(cols);
    }
    setBoard(rows);
  }, [size]);

  useEffect(() => {
    let newBoard = [...board];
    moves.forEach((move) => {
      let row = Math.ceil(move.location / size) - 1;
      let col = (move.location % size) - 1;
      if (col < 0) {
        col += size;
      }
      let newRow = [...newBoard[row]];
      newRow[col] = move.symbol;
      newBoard[row] = newRow;
    });
    setBoard(newBoard);
  }, [moves]);

  const changeMove = (move) => {
    let row = Math.ceil(move.location / size) - 1;
    let col = (move.location % size) - 1;
    if (col < 0) {
      col += size;
    }
    let newBoard = [...board];
    newBoard[row][col] = move.symbol;
    setBoard(newBoard);
  };

  const handleCellClick = (id) => {
    fetch("http://localhost:8080/addMove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: id,
        gameId: 126,
        userId: 35,
        symbol: "x",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          alert("You are winner!!");
        }
      });
  };

  return (
    <div style={{ height: "70vh" }}>
      <table>
        <tbody>
          {board &&
            board.map((row) => {
              return (
                <tr>
                  {row.map((col) => {
                    cell++;
                    return (
                      <td
                        id={cell}
                        onClick={(e) => {
                          handleCellClick(e.target.id);
                        }}
                      >
                        {col}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
