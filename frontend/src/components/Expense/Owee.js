import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import "../../css/expense.css";

const Owee = (props) => {
  const [users, setUsers] = useState(props.users);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(props.totalAmount);
  const [indiAddAmount, setIndiAddAmount] = useState(0);
  const [typeOfSplit, setTypeOfSplit] = useState(null);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    setTotalAmount(props.totalAmount);
  }, [props.totalAmount]);

  useEffect(() => {
    setTypeOfSplit(props.type);
  }, [props.type]);

  const [amounts, setAmounts] = useState({});

  const selectUser = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(user)) {
        const newSet = prevSelectedUsers.filter((user2) => user2 !== user);
        return newSet;
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleAmountChange = (userId, value) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [userId]: value,
    }));
    let total = 0;
    Object.values({ ...amounts, [userId]: value }).forEach((amount) => {
      total += parseFloat(amount) || 0;
    });
    setIndiAddAmount(total);
  };

  const handlePaperClick = (user) => {
    if (selectedUsers.includes(user)) {
      // Deselecting user, reset amount to zero
      handleAmountChange(user.userID, 0);
    }
    selectUser(user);
  };

  const handleTextFieldClick = (e) => {
    // Prevent paper deselection when clicking on text field
    e.stopPropagation();
  };

  const handleEmptyClose = () => {
    setSelectedUsers([]);
    setAmounts({}); // Reset amounts when closing dialog
    props.onClose([]);
  };

  const handleClose = () => {
    // Return an array of objects containing user and amount
    if (typeOfSplit != "equally") {
      if (totalAmount - indiAddAmount == 0) {
        const selectedUsersWithAmounts = selectedUsers.map((user) => ({
          userID: user.userID,
          username: user.username,
          amount: amounts[user.userID] || 0, // Default to 0 if amount not provided
        }));
        props.onClose(selectedUsersWithAmounts);
      }
    }else{
      const length = selectedUsers.length;
      const selectedUsersWithAmounts = selectedUsers.map((user) => ({
        userID: user.userID,
        username: user.username,
        amount: totalAmount/length || 0, // Default to 0 if amount not provided
      }));
      props.onClose(selectedUsersWithAmounts);
    }
  };

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
      <DialogTitle className="dialog-title">
        Total Amount : {totalAmount}
      </DialogTitle>
      <DialogContent className="dialog-content">
        <div className="dialog-content-inner">
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user);
            return (
              <Paper
                elevation={isSelected ? 5 : 3}
                onClick={() => handlePaperClick(user)} // Handle paper click
                className={`dialog-user center ${isSelected ? "selected" : ""}`}
                key={user.id}
              >
                {user.username}
                {typeOfSplit !== "equally" && (
                  <TextField
                    type="number"
                    value={amounts[user.userID] || ""}
                    onChange={(e) =>
                      handleAmountChange(user.userID, e.target.value)
                    }
                    label="Amount"
                    onClick={handleTextFieldClick}
                    disabled={!isSelected}
                  />
                )}
              </Paper>
            );
          })}
        </div>
        {typeOfSplit !== "equally" && (
          <div>
            Amount Left :{" "}
            <p className={totalAmount - indiAddAmount == 0 ? "green" : "red"}>
              {totalAmount - indiAddAmount}
            </p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button onClick={handleEmptyClose}>Cancel</button>
        <button onClick={handleClose}>Save</button>
      </DialogActions>
    </Dialog>
  );
};

export default Owee;
