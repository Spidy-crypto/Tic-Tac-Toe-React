import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./home.css";
import Socket from "./socket";

function Board(props) {
  let socket = new Socket();

  let cell = 0;
  const { gameId } = useParams();
  const [size, setSize] = useState(0);
  const [moves, setMoves] = useState([]);
  const [board, setBoard] = useState([[]]);
  const [disabled, setDisabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isInitialize, setIsInitialize] = useState(false);
  const [currentUser, setCurrentUser] = useState(1);
  const [lastMoveUserId, setLastMoveUserId] = useState(-1);
  const [finishStatus, setFinishStatus] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [symbol, setSymbol] = useState("X");
  const [turn, setTurn] = useState("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    setDisabled(true);
    fetch("http://localhost:8080/game/" + gameId)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "Completed" || data.status == "Terminated") {
          let arr = [...messages];
          arr.push("Game is " + data.status);
          setMessages(arr);
          setDisabled(true);
          console.log("here");
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

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!finishStatus) {
      if (window.confirm("Do you want to go back ?")) {
        setFinishStatus(true);
        fetch("http://localhost:8080/terminateGame/" + gameId, {
          method: "PUT",
        });
        navigate("/");
      } else {
        window.history.pushState(null, null, window.location.pathname);
        setFinishStatus(false);
      }
    }
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

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

  useEffect(() => {
    if (!disabled) {
      if (lastMoveUserId == 1) {
        setTurn("User2's Turn");
      } else {
        setTurn("User1's Turn");
      }
    }
  }, [lastMoveUserId]);

  const changeMove = (move) => {
    setLastMoveUserId(move.userId);
    let userId = searchParams.get("id");
    if (userId) {
      setSymbol("O");
      setCurrentUser(2);
    } else {
      setSymbol("X");
      setCurrentUser(1);
    }
    if (currentUser == lastMoveUserId) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

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

  useEffect(() => {
    setIsInitialize(true);
  }, [board]);

  useEffect(() => {
    if (isInitialize && size > 0) {
      socket.connect(changeMove, messages, setMessages, gameId, setDisabled);
    }
  }, [isInitialize, size]);

  const handleCellClick = async (id) => {
    if (!disabled) {
      fetch("http://localhost:8080/addMove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: id,
          gameId: gameId,
          userId: currentUser,
          symbol: symbol,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            setDisabled(true);
            setCount(count + 1);
          }
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
        {messages && messages.map((message) => <p>{message}</p>)}
      </div>
    </div>
  );
}

export default Board;
