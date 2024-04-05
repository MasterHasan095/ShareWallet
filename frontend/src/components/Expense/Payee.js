import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import "../../css/expense.css";

const Payee = (props) => {
  const [users, setUsers] = useState(props.users);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const selectUser = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(user)) {
        return prevSelectedUsers.filter((user) => user !== user);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleClose = () =>{
    console.log("handling Closing");
    console.log(selectedUsers)
    props.onClose();
  }
  console.log(users);
  return (
    <Dialog
      open={props.open}
      className="dialog center"
      maxWidth="70vw"
      PaperProps={{
        style: {
          padding: "0",
          width: "1000px",
          margin: "0",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle>This is a title</DialogTitle>
      <DialogContent className="dialog-content">
        {users.map((user) => {
          const isSelected = selectedUsers.includes(user);
          return (
            <Paper
              elevation={isSelected ? 5 : 3} // Increase elevation if selected
              onClick={() => selectUser(user)}
              className={`dialog-user center ${isSelected ? "selected" : ""}`}
              key={user.id}
            >
              {user.username}
            </Paper>
          );
        })}
      </DialogContent>
      <DialogActions>
        <button onClick={handleClose}>Click this nigga</button>
        <button>Jaato ka itihaas pata hai?</button>
      </DialogActions>
    </Dialog>
  );
};

export default Payee;
