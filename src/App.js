import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Row from './components/Row';
 
const url = 'http://localhost:3001'
 
function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
 
  useEffect(() => {
    axios.get(url)
      .then(response => {
        console.log("Fetched tasks:", response.data);
        setTasks(response.data);
      })
      .catch(error => {
        const errorMessage = error.response?.data?.error || error.message || "Tuntematon virhe";
        alert(errorMessage);
      });
  }, []);
 
 
      const addTask = () => {
        axios.post(url + '/create', {
          description: task
        })
          .then(response => {
            setTasks([...tasks, response.data]);
            setTask('');
          })
          .catch(error => {
            const errorMessage = error.response?.data?.error || error.message || "Tuntematon virhe";
            alert(errorMessage);
          });
      }
     
 
      const deleteTask = (id) => {
        console.log("Deleting task with ID:", id);
     
        if (id === undefined) {
          console.error("Invalid task ID: undefined");
          return;
        }
        axios.delete(url + "/delete/" + id)
          .then(response => {
            setTasks(prevTasks => prevTasks.filter(item => item.id !== id));
          })
          .catch(error => {
            const errorMessage = error.response?.data?.error || error.message || "Tuntematon virhe";
            alert(errorMessage);
          });
      };
         
  return (
    <div id="container">
      <h3>Todos</h3>
      <form>
        <input placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTask();
            }
          }}
        />
      </form>
        <ul>
            {tasks.map(item => (
            <Row key={item.id} item={item} deleteTask={deleteTask} />
            ))}
        </ul>
    </div>
  );
}
 
export default App;