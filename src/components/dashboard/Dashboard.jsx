import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
const apiUrl = import.meta.env.VITE_API_URL;
import { Container, Grid, Paper, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import Header from "../../pages/Header";
import Cookies from "js-cookie";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const token = Cookies.get("authToken")

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${apiUrl}/api/v1/task`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(response.data);
    }
    fetchTasks();
  }, []);

  const taskDistribution = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Priority Distribution",
        data: [
          tasks.filter((task) => task.priority === "High").length,
          tasks.filter((task) => task.priority === "Medium").length,
          tasks.filter((task) => task.priority === "Low").length,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
      },
    ],
  };

  const completionRate = {
    labels: tasks.map((task) => `${task.title} - (${task.priority})`),
    datasets: [
      {
        label: "Completion Rate",
        data: tasks.map((task) => task.completed),
        fill: false,
        backgroundColor: "#82cdff",
        borderColor: "#4bc0c0",
      },
    ],
  };

  return (
    <Container>
      <Header />
      <Typography variant="h5" fontWeight="bold" margin={4}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">Task Distribution</Typography>
            <Pie data={taskDistribution} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6">Completion Rate</Typography>
            <Bar data={completionRate} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
