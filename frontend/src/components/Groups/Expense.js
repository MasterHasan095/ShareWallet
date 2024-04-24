import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { Paper } from "@mui/material";
import "../../css/expense.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Expense = (props) => {
  const [expense, setExpense] = useState();
  const [groupID, setGroupID] = useState();
  const [isLoading, setIsLoading] = useState(true); // Start with loading state true
  const [payee, setPayee] = useState();
  const [payees, setPayees] = useState();
  const [deleted, setDeleted] = useState(false); // State to track if an expense has been deleted

  // Update the state when props.expense changes
  useEffect(() => {
    setIsLoading(true);
    setExpense(props.expense);
    setGroupID(props.groupID);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (expense.payee.length === 1) {
          setIsLoading(true);
          const payeeID = expense.payee[0].userID;
          const response = await axios.get(
            `http://localhost:5555/users/${payeeID}`
          );
          setPayee(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [expense]);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0"); // Get day with leading zero if needed
    const month = dateObject.toLocaleString("default", { month: "short" }); // Get month abbreviation
    return `${day} ${month}`; // Combine day and month
  };

  const handleExpenseDelete = async (e, id) => {
    e.preventDefault();
    console.log(id);
    console.log(`http://localhost:5555/groups/expense/${groupID}/${id}`);
    try {
      const response = await axios.delete(
        `http://localhost:5555/groups/expense/${groupID}/${id}`
      );
      // If the expense is successfully deleted, set the 'deleted' state to true
      setDeleted(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  // If 'deleted' state changes, fetch updated data
  useEffect(() => {
    if (deleted) {
      props.refresh();
      setDeleted(false);
    }
  }, [deleted]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <Link
          to={`/ShareWallet/expense/${expense.expenseID}`}
          style={{ textDecoration: "none" }}
        >
          <Paper elevation={3} className="expense-paper center">
            <div className="expense-left expense-div center">
              Amount : {expense.amount}
            </div>
            <div className="expense-mid expense-div center">
              <div>{expense.expenseName}</div>
              {payee ? (
                <div>Paid By {payee.username}</div>
              ) : (
                <div>There are Multiple People</div>
              )}
            </div>
            <div className="expense-right expense-div center">
              <div>
                <Link
                  to={`/ShareWallet/expense/edit/${expense.expenseID}`}
                  style={{ textDecoration: "none" }}
                >
                  <button>Edit</button>
                </Link>
                <button
                  onClick={(e) => handleExpenseDelete(e, expense.expenseID)}
                >
                  Delete
                </button>{" "}
              </div>
              {formatDate(expense.date)}
            </div>
          </Paper>
        </Link>
      )}
    </div>
  );
};

export default Expense;
