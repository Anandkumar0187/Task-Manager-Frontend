import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Header from "../../pages/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const apiUrl = import.meta.env.VITE_API_URL;

const TaskDetails = () => {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const id = sessionStorage.getItem("taskId");
  const navigate = useNavigate();
  const token = Cookies.get("authToken")

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const { data } = await axios.get(`${apiUrl}/api/v1/task/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log("🚀 ~ fetchData ~ res:", data)
        setDetails(data);
      };
      fetchData();
    }
  }, [id]);

  const { _id, title, description, dueDate, priority, completed } = details;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/api/v1/task/${_id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success("Task deleted successfully!");
      setOpen(false);
      navigate("/home");
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
      toast.error("Failed to delete the task.");
    }
  };
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
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
          right: "30vw",
        }}
      >
        Back
      </Button>
      <Typography variant="h5" fontWeight="bold" marginTop={2}>
        Task Details
      </Typography>
      {!_id ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: "50vw",
            margin: "2rem auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="600" color="primary" gutterBottom>
            {title}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>

          <Typography variant="body2" color="error" gutterBottom>
            Due Date: {new Date(dueDate).toLocaleDateString("en-GB")}
          </Typography>

          <Chip
            label={`Priority: ${priority}`}
            color={
              priority === "High"
                ? "error"
                : priority === "Medium"
                ? "warning"
                : "success"
            }
            sx={{ mb: 1 }}
          />

          <Typography variant="body2" color={completed ? "green" : "red"}>
            {completed ? "Completed" : "Incomplete"}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/edit/${_id}`)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenDialog}
            >
              Delete
            </Button>
          </Box>
          <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this task?
              </Typography>
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
        </Box>
      )}
    </Box>
  );
};

export default TaskDetails;
