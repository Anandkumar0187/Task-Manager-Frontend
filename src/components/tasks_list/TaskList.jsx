import {
  Box,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  Divider,
  Button,
  Skeleton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/Header";
import { toast } from "react-toastify";
import CalendarView from "../calendar/Calendar";
const apiUrl = import.meta.env.VITE_API_URL;
import Cookies from "js-cookie";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState("dueDate");
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loader, setLoader] = useState(true);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  const priorityValue = (priority) => {
    switch (priority) {
      case "High":
        return 3;
      case "Medium":
        return 2;
      case "Low":
        return 1;
      default:
        return 0;
    }
  };

  const sortTasks = (tasks, option) => {
    switch (option) {
      case "priority":
        return [...tasks].sort(
          (a, b) => priorityValue(b.priority) - priorityValue(a.priority)
        );
      case "dueDate":
        return [...tasks].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
      default:
        return tasks;
      }
    };
    
  const fetchTasks = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${apiUrl}/api/v1/task`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(response.data);
      setSortedTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoader(false);
      toast.error("No task found !");
    } finally {
      setLoader(false);
    }
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const data = sortTasks(tasks, sortOption);
    setSortedTasks(data);
  }, [sortOption, tasks]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/api/v1/task/${idToDelete}`,
        {headers: {
          'Authorization': `Bearer ${token}`
        }}
      );
      toast.success("Task deleted successfully!");
      await fetchTasks();
      setOpen(false);
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
      toast.error("Failed to delete the task.");
    }
  };

  const handleOpenDialog = (id) => {
    setIdToDelete(id);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const filteredTasks = sortedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log("🚀 ~ TaskList ~ filteredTasks:", filteredTasks)

  return (
    <Box>
      <Header />
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Task List
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {filteredTasks?.length ? (
          <List>
            {filteredTasks.map((task) => (
              <Box key={task._id}>
                <ListItem
                  button="true"
                  onClick={() => {
                    sessionStorage.setItem("taskId", task._id);
                    setLoader(false);
                    navigate(`/task-details`);
                  }}
                  sx={{
                    backgroundColor: "#F7F7F7",
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={<span>
                        {task.title}{" "}
                        <span
                          style={{
                            color: task.completed === 100 ? "#C0C0C0" : "red",
                          }}
                        >
                          ({task.completed === 100 ? "Completed" : `Pending ${100 - task.completed}%`})
                        </span>
                      </span>}
                      secondary={<span>
                        {"Priority: "}
                        <span
                          style={{
                            color: task.priority === "High" ? "#FF6B6B" : task.priority === "Medium" ? "#FFD700" : "#A8E6CF",
                          }}
                        >
                          {task.priority}
                        </span>
                      </span>}
                    />
                  </Box>
                  <Box
                    sx={{
                      textAlign: "right",
                      width: "30rem",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Typography sx={{ color: "#666" }}>
                      Due Date:{" "}
                      {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </Typography>
                    <Tooltip title="Edit task">
                    <Typography
                      sx={{ color: "blue" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit/${task._id}`);
                      }}
                    >
                      <Edit />
                    </Typography>
                    </Tooltip>
                    <Tooltip title="Delete task">
                    <Typography
                      sx={{ color: "red" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(task._id);
                      }}
                    >
                      <Delete />
                    </Typography>
                    </Tooltip>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            {loader ? (
              <CircularProgress />
            ) : (
              <Typography variant="h6" color="textSecondary">
                No Task Found !!
              </Typography>
            )}
          </Box>
        )}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this task?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Divider />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/create")}
        >
          Create New
        </Button>
      </Box>
      <CalendarView tasks={tasks}/>
    </Box>
  );
};

export default TaskList;
