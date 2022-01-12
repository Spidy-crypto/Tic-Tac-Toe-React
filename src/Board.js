import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import { useLocation } from "react-router-dom";
import Socket from "./socket";

let userId = 35;
let socket = new Socket();

function Board(props) {
  const { gameId } = useParams();
  const [size, setSize] = useState(0);
  const [moves, setMoves] = useState([]);
  const [board, setBoard] = useState([[]]);
  const [disabled, setDisabled] = useState(false);
  const [symbol, setSymbol] = useState("O");
  const [messages, setMessages] = useState([]);
  const [isInitialize, setIsInitialize] = useState(false);

  const location = useLocation();

  const changeMove = (move) => {
    setBoard((board) => {
      let row = Math.ceil(move.location / size) - 1;
      let col = (move.location % size) - 1;
      if (col < 0) {
        col += size;
      }
      let newBoard = [...board];
      newBoard[row][col] = move.symbol;
      return newBoard;
    });
  };

  let cell = 0;
  useEffect(() => {
    if (location.state.user1Id == userId) {
      setSymbol("X");
    }

    fetch("http://localhost:8080/game/" + gameId)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "Completed") {
          setDisabled(true);
        }
        setSize(data.size);
        setMoves(data.movesDtoList);
      });

    return () => {
      socket.disconnect();
    };
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
    if (isInitialize && size > 0) {
      socket.connect(changeMove, messages, setMessages, gameId);
    }
  }, [isInitialize, size]);

  useEffect(() => {
    setIsInitialize(true);
  }, [board]);

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

  const handleCellClick = (id) => {
    if (!disabled) {
      fetch("http://localhost:8080/addMove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: id,
          gameId: gameId,
          userId: userId,
          symbol: symbol,
        }),
      });
    }
  };

  return (
    <div style={{ height: "70vh", display: "flex" }}>
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
      <div style={{ marginRight: "5%" }}>
        {messages.map((message) => (
          <p>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default Board;
