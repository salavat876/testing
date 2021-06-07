import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoList from './components/list';

function App() {
  const [state, setState] = useState([]);

  const [toDoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    fetch(' http://localhost:8000/state')
      .then((res) => res.json())
      .then((res) => setState(res)).catch(() => alert('похоже, вы не включили сервер. Включите сервер и повторите попытку'));
  }, []);

  const removeTodo = (id) => {
    setState(state.filter((todo) => {
      axios.delete(`http://localhost:8000/state/${id}`);
      return todo.id !== id;
    }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (toDoTitle) {
      setState([
        ...state,
        {
          id: Date.now(),
          title: toDoTitle,
          completed: false,
        },
      ]);
      axios.post('http://localhost:8000/state', {
        id: Date.now(),
        title: toDoTitle,
        completed: false,
      }).then((res) => console.log(res));
      setTodoTitle('');
    } else {
      alert('Вы ничего не ввели!');
    }
  };

  const handleKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      handleSubmit(ev);
    }
  };

  const toggleToDo = (id) => {
    setState(state.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        axios.patch(`http://localhost:8000/state/${id}`, {
          completed: todo.completed,
        });// .then((res) => setState({ completed: res.data.completed }))
          // this function isnt work((
      }
      return todo;
    }));
  };

  return (
          <div className="container" >
              <h1>Todo App</h1>

              <div className=" flex input-field">
                  <input
                      type="text"
                      value={toDoTitle}
                      onChange={(event) => setTodoTitle(event.target.value)}
                      onKeyPress={handleKeyPress}

                  />
                  <button onClick={handleSubmit} className=" btn card-panel teal lighten-2">Отправить</button>
              </div>

              <TodoList todos={state} removeTodo={removeTodo} toggleToDo = {toggleToDo} />
          </div>

  );
}

export default App;