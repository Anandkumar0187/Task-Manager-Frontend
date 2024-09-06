import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import "./calendarView.css";

const CalendarView = ({tasks}) => {
  const [date, setDate] = useState(new Date());

  // Adding class name for the changing the color of date for due date
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const taskForDate = tasks?.filter(
        (task) => new Date(task.dueDate).toDateString() === date.toDateString()
      );
      if (taskForDate.length > 0) {
        return "task-date";
      }
    }
    return "";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{ p: 3, mb: 3, display: "flex", justifyContent: "space-evenly" }}
      >
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Calendar View
          </Typography>
          <Divider />
          <Calendar
            value={date}
            onChange={setDate}
            // tileContent={tileContent}
            tileClassName={tileClassName}
          />
        </CardContent>
        <CardContent>
          <Typography variant="h6" color="error">
            Upcoming Deadlines
          </Typography>
          <Divider />
          {tasks ? (<List>
            {tasks
              ?.filter((task) => new Date(task.dueDate) > new Date())
              .map((task) => (
                <ListItem key={task._id}>
                  <Typography variant="body1">
                    <span style={{ color: "light blue" }}>
                      {task.title}
                      {" - "}
                      <span style={{ color: "red" }}>
                        {new Date(task.dueDate).toLocaleDateString("en-GB")}
                      </span>
                    </span>
                  </Typography>
                </ListItem>
              ))}
          </List>) : (
            <Typography>No due deadlines</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CalendarView;
