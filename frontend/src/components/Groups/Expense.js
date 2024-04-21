import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { Paper } from "@mui/material";
import "../../css/expense.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Expense = (props) => {
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(true); // Start with loading state true
  const [payee, setPayee] = useState();
  const [payees, setPayees] = useState();

  // Update the state when props.expense changes
  useEffect(() => {
    setIsLoading(true);
    setExpense(props.expense);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (expense.payee.length == 1) {
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
              {payee ? (
                <div>{payee.username}</div>
              ) : (
                <div> there are multiple payees</div>
              )}
            </div>
            <div className="expense-right expense-div center">
              {formatDate(expense.date)}
            </div>
          </Paper>
        </Link>
      )}
    </div>
  );
};

export default Expense;
