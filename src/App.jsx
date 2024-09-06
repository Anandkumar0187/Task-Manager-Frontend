import { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import TaskForm from "./components/create_tasks/TaskForm";
import Dashboard from "./components/dashboard/Dashboard";
import TaskList from "./components/tasks_list/TaskList";
import TaskDetails from "./components/taskDetails/TaskDetails";
import axios from "axios";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [taskData, setTaskData] = useState({});
  const token = Cookies.get('authToken')
  // const handleSelectId = async (taskId) => {
  //   const res = await axios.get(`${apiUrl}/api/v1/task/${taskId}`,{
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });
  //   setTaskData(res.data);
  // };

  return (
    <Box>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Login/>}/>
          <Route
            path="/home"
            element={<TaskList />}
          />
          <Route path="/create" element={<TaskForm />} />
          <Route path="/edit/:id" element={<TaskForm />} />
          <Route
            path="/task-details"
            element={<TaskDetails />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;