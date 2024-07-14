import React, { useEffect, useState } from "react";

//create your first component
const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [Tareas, setTareas] = useState([]);
  const [user, setUser] = useState(null);

  const apiEndpoint = "https://playground.4geeks.com/todo/todos/vbarrera";

  const validateTareas = (tarea) => {
    if (!tarea || !tarea.trim()) {
      alert("El valor de la tarea no puede estar vacío");
      return false;
    }
    return true;
  };

  const createUser = async () => {
    await fetch("https://playground.4geeks.com/users/vbarrera", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: "vbarrera" }),
    }).then((resp) => {
      if (resp.ok) {
        alert("Se ha creado el usuario correctamente");
        getUser();
      }
    });
  };

  const getUser = async () => {
    const response = await fetch("https://playground.4geeks.com/users/vbarrera");
    if (response.status === 404) {
      createUser();
    } else {
      const userData = await response.json();
      setUser(userData);
      getTareas();
    }
  };

  const getTareas = async () => {
    const response = await fetch(apiEndpoint);
    if (response.ok) {
      const tasksData = await response.json();
      setTareas(tasksData);
    } else {
      console.error("Error fetching tasks:", response.statusText);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const createTarea = async (newTarea) => {
    if (!validateTareas(newTarea)) return;
    const updatedTareas = [...Tareas, newTarea];
    setTareas(updatedTareas);
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTareas),
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTarea = async (tareaToDelete) => {
    const updatedTareas = Tareas.filter(tarea => tarea !== tareaToDelete);
    setTareas(updatedTareas);
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTareas),
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const clearTarea = async () => {
    setTareas([]);
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
      });
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  };

  return (
    <div className="Container">
      <h1>Lista de TODO</h1>
      <ul>
        <li>
          <input 
            type="text" 
            placeholder=" Indica la tarea"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyUp={(e) => { 
              if (e.key === "Enter") {
                createTarea(inputValue);
                setInputValue("");
              }
            }}
          />
        </li>

        {Tareas.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => deleteTarea(item)}>🗑</button>
          </li>
        ))}
      </ul>
      <div>{Tareas.length} Tareas</div>
      <button onClick={clearTarea}>Limpiar todas las tareas</button>
    </div>
  );
};

export default Home;