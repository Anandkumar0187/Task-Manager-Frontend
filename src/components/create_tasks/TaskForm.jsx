import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../pages/Header";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const apiUrl = import.meta.env.VITE_API_URL;

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    completed: 0,
  });
  const { id } = useParams();
  // console.log("form data ======>", formData);

  const navigate = useNavigate();
  const token = Cookies.get("authToken")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formateDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-CA");
    return formattedDate.split("/").join("-");
  };

  useEffect(() => {
  const fetchData = async () => {
    if (id) {
      const { data } = await axios.get(`${apiUrl}/api/v1/task/${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }); //Fetching task by Id

      const editedData = {
        title: data.title,
        description: data.description,
        dueDate: formateDate(data.dueDate),
        priority: data.priority,
        completed: data.completed,
      };
      setFormData(editedData);
    }
  };
  fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      formData.completed = Number(formData.completed)
      if (id) {
        response = await axios.put(`${apiUrl}/api/v1/task/${id}`,formData,{
          
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        toast.success("Task updated successfully");
      } else {
        response = await axios.post(`${apiUrl}/api/v1/task`,formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        toast.success("Task created successfully");
      }
      // console.log(response);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        completed: 0,
      });
      navigate("/home");
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error.response.data.errors[0].msg);
      toast.error(error.response.data.errors[0].msg)
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box>
      <Header />
      <Button
        variant="contained"
        color="primary"
        onClick={handleBack}
        sx={{
          top: "2em",
          right: "30em",
        }}
      >
        Back
      </Button>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            margin: "2rem auto",
            padding: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" component="h2">
            Task Form
          </Typography>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            required
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
          />
          <FormControl fullWidth required>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          {id && (
            <FormControl fullWidth >
            <InputLabel id="completion-label">Completion Rate</InputLabel>
            <Select
              labelId="completion-label"
              name="completed"
              value={formData.completed}
              onChange={handleChange}
            >
              <MenuItem value="0">0%</MenuItem>
              <MenuItem value="20">20%</MenuItem>
              <MenuItem value="40">40%</MenuItem>
              <MenuItem value="60">60%</MenuItem>
              <MenuItem value="80">80%</MenuItem>
              <MenuItem value="100">100%</MenuItem>
            </Select>
          </FormControl>
          )}
          <Box display="flex" justifyContent="space-evenly">
          <Button variant="contained" color="error" sx={{width : "40%"}} onClick={()=> {
            setFormData({
              title: "",
              description: "",
              dueDate: "",
              priority: "",
              completed: false,
            });
          }}>
            Clear
          </Button>
          <Button variant="contained" color="primary" sx={{width : "40%"}} type="submit">
            {id ? `Update` : `Create`}
          </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
export default TaskForm;
