import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tareas, setTareas] = useState([]);
  const [user, setUser] = useState(null);

  const apiEndpoint = "https://playground.4geeks.com/todo/users/vbarrera";

  const validateTareas = (tarea) => {
    if (!tarea || !tarea.trim()) {
      alert("El valor de la tarea no puede estar vacío");
      return false;
    }
    return true;
  };

  const createUser = async () => {
    await fetch(apiEndpoint, {
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
    const response = await fetch(apiEndpoint);
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

  const syncWithServer = async (tasks) => {
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });
    } catch (error) {
      console.error('Error syncing tasks:', error);
    }
  };

  const createTarea = async (newTarea) => {
    if (!validateTareas(newTarea)) return;
    const updatedTareas = [...tareas, { label: newTarea, done: false }];
    setTareas(updatedTareas);
    syncWithServer(updatedTareas);
  };

  const deleteTarea = async (index) => {
    const updatedTareas = tareas.filter((_, i) => i !== index);
    setTareas(updatedTareas);
    syncWithServer(updatedTareas);
  };

  const clearTarea = async () => {
    setTareas([]);
    syncWithServer([]);
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

        {tareas.map((item, index) => (
          <li key={index}>
            {item.label}
            <button onClick={() => deleteTarea(index)}>🗑</button>
          </li>
        ))}
      </ul>
      <div>{tareas.length} Tareas</div>
      <button onClick={clearTarea}>Limpiar todas las tareas</button>
    </div>
  );
};

export default Home;
