import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/v1/user/login`, formData);
      Cookies.set("authToken", res.data.token);
      // console.log("🚀 ~ handleSubmit ~ res:", res);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Login error:", error.response.data.message);
    }
  };

  return (
    <Box>
      <Header />
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 5,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onSubmit={handleSubmit}
          >
            Login
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              textAlign: "center",
            }}
          >
            <Typography>Need Help? </Typography>
            <Typography
              variant="button"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ cursor: "pointer" }}
            >
              Register
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
