import React, { useEffect, useState } from "react";
import Board from "react-trello";
import axios from "axios";
import FormModal from "./components/FormModal";
import LazyLoad from "react-lazyload";
import FormSelect from "./components/FormSelect";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bg, setBg] = useState("");
  const [scrollTodos, setScrollTodos] = useState(10);
  const [scrollCompleted, setScrollCompleted] = useState(10);

  const fetchDataTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    setTasks(response.data.slice(0, 20));
  };
  const fetchDataUsers = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    setUsers(response.data);
  };
  useEffect(() => {
    fetchDataTodos();
    fetchDataUsers();
  }, []);

  const data = {
    lanes: [
      {
        id: "todos",
        title: "TODOS",
        currentPage: 1,
        style: {
          width: 310,
          height: "calc(100vh - 25px)",
          backgroundColor: "#ebecf0",
          textColor: "#172b4d",
          boxShadow: "rgb(0 0 0 / 10%) 0px 0px 5px",
        },
        cardStyle: {
          height: "100%",
          width: "100%",
          borderRadius: 10,
          margin: "3px 18px",
          boxShadow: "rgb(0 0 0 / 10%) 0px 0px 5px",
          backgroundColor: "White",
          textColor: "#172b4d",
        },
        cards: tasks
          .filter((task) => task.completed === false)
          .slice(0, scrollTodos)
          .map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
          })),
      },
      {
        id: "completed",
        title: "COMPLETED",
        currentPage: 1,
        style: {
          width: 310,
          height: "calc(100vh - 25px)",
          backgroundColor: "#ebecf0",
          textColor: "#172b4d",
          boxShadow: "rgb(0 0 0 / 10%) 0px 0px 5px",
        },
        cardStyle: {
          height: "100%",
          width: "100%",
          borderRadius: 10,
          margin: "3px 18px",
          boxShadow: "rgb(0 0 0 / 10%) 0px 0px 5px",
          backgroundColor: "White",
          textColor: "#172b4d",
        },
        cards: tasks
          .filter((task) => task.completed === true)
          .slice(0, scrollCompleted)
          .map((item) => ({
            id: item.id,
            title: item.title,
            completed: item.completed,
          })),
      },
    ],
  };

  const handleCardClick = (id) => {
    console.log("🚀 ~ file: App.js ~ line 77 ~ handleCardClick ~ id", id);
    setShowModal(true);
    const metaData = tasks.find((task) => task.id === id);
    console.log(
      "🚀 ~ file: App.js ~ line 77 ~ handleCardClick ~ metaData",
      metaData
    );
    setEdit(metaData);
  };

  const handleClose = () => setShowModal(false);

  const handleChangeBackground = (e) => {
    const event = e.target.value;
    console.log(
      "🚀 ~ file: App.js ~ line 150 ~ handleChangeBackground ~ event",
      event
    );
    setBg(event);
  };

  const handleSetDefaultBackground = () => {
    setBg("");
  };

  const handleMouseMove = (e) => {
    e.target.style.backgroundPosition = `calc(50% + ${
      e.nativeEvent.offsetX / 200
    }px) calc(50% + ${e.nativeEvent.offsetY / 200}px)`;
  };

  const fetchCards = async (laneId, requestedPage) => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );

    setTasks(response.data);
    if (laneId === "todos") {
      setScrollTodos(scrollTodos + 10);
    }
    if (laneId === "completed") {
      setScrollCompleted(scrollCompleted + 10);
    }
  };

  function paginate(requestedPage, laneId) {
    return fetchCards(laneId, requestedPage);
  }

  return (
    <div className="App">
      {tasks.length > 0 ? (
        <LazyLoad>
          <Board
            data={data}
            draggable
            onCardClick={handleCardClick}
            style={{
              backgroundImage: "url(" + bg + ")",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            onMouseMove={handleMouseMove}
            onLaneScroll={paginate}
          />
        </LazyLoad>
      ) : (
        <div className="loaderContainer">
          <div className="loader"></div>
        </div>
      )}

      <FormSelect
        handleChangeBackground={handleChangeBackground}
        handleSetDefaultBackground={handleSetDefaultBackground}
      />

      <FormModal
        users={users}
        handleClose={handleClose}
        showModal={showModal}
        edit={edit}
        setEdit={setEdit}
        setTasks={setTasks}
        tasks={tasks}
      />
    </div>
  );
}

export default App;
