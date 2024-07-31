import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";

const Home = () => {

    const connectionRef = useRef(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const { user } = useAuth();
    // const [taskOwner, setTaskOwner] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            const { data } = await axios.get('/api/tasks/getincomplete');
            setIncompleteTasks(data);
        }
        loadTasks();
    }, []);
    
    useEffect(() => {
        const connectHub = async () => {
            const connection = new HubConnectionBuilder().withUrl("/api/taskshub").build();
            await connection.start();
            // connection.invoke("newUser");
            connectionRef.current = connection;

            connection.on('newTaskAdded', task => {
                setIncompleteTasks(incompleteTasks => [...incompleteTasks, task]);
            });

            connection.on('reloadTasks', tasks => {
                setIncompleteTasks(tasks);
            }); 

            // connection.on('taskAssigned', user => {
            //     setTaskOwner(`${user.firstName} ${user.lastName}`);
            // }); 
        }
        connectHub();
    }, []);
    
    const onAddTaskClick = async () => {
        // await connectionRef.current.invoke('addtask', taskTitle);
        await axios.post('/api/tasks/addtask', { title: taskTitle })
        setTaskTitle('');
    }

    const onDoneClick = async (task) => {
        await axios.post('/api/tasks/markcompleted', task);
    }

    const onDoingThisOneClick = async (task) => {
        await axios.post('/api/tasks/assigntask', { taskId: task.id });
    }

    const getButton = (task) => {
        if (task.userId === null){
            return <button className='btn btn-dark' onClick={() => onDoingThisOneClick(task)}>I'm doing this one!</button>
        }
        if (task.userId === user.id){
            return <button className='btn btn-success' onClick={() => onDoneClick(task)}>I'm done!</button>
        }
        return <button className='btn btn-warning' disabled={true}>{task.user.firstName} {task.user.lastName} is doing this</button>
    }

    return (
        <div style={{marginTop:70}}>
            <div className="row">
                <div className="col-md-10">
                    <input type="text"
                        className="form-control"
                        placeholder="Task Title"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}/>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={onAddTaskClick}>Add Task</button>
                </div>
            </div>
            <table className="table table-hover table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {incompleteTasks.map(task => {
                        return <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                            {getButton(task)}
                        </td>
                    </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
};

export default Home;