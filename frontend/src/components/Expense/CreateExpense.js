import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/form.css";
import { Paper } from "@mui/material";
import Loading from "../Loading";
import axios from "axios";
import Payee from "./Payee"
// Import useHistory hook from React Router

const CreateExpense = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    expenseName: "",
    amount: 0,
    typeOfSplit: "equally",
    payee: [],
    owee: [],
  });
  const { id } = useParams();

  const handleOpenDialog = () =>{
    console.log("Clicked")
    setOpenDialog(true);
  }
  const handleCloseDialog = () =>{
    setOpenDialog(false);
  }

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5555/groups/${id}/users`
        );
        setUsers(response.data.users);
        console.log(response.data);
        setIsLoading(false);
      };

      fetchUsers();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  console.log(id);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // If the event is from a checkbox input, handle the change in payee array
      if (checked) {
        console.log("Atleast here");
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: [...prevFormData[name], value],
        }));
        console.log(formData);
      } else {
        // If the checkbox is unchecked, remove the user from the payee array
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: prevFormData[name].filter((userId) => userId !== value),
        }));
      }
    } else {
      // For other inputs, update the form data normally
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Paper elevation={3} className="form center">
          <form className="center">
            <label>
              Expense Name:
              <br />
              <input
                type="text"
                name="expenseName"
                value={formData.expenseName}
                onChange={handleChange}
                placeholder="Enter Expense Name"
                className="center"
              />
            </label>
            <br />
            <label>
              Expense Amount:
              <br />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Expense Amount"
                className="center"
              />
            </label>
            <br />
            <label>
              Type of split:
              <br />
              <select
                name="typeOfSplit"
                value={formData.typeOfSplit}
                onChange={handleChange}
                className="center"
              >
                <option value="">Select Type of Split</option>
                <option value="equally">Equal Split</option>
                <option value="unequally">Unequal Split</option>
                <option value="By percentage">By Percentage</option>
                <option value="By Shares">By Shares</option>
              </select>
            </label>

            <div className="expense-payees-select">
              Paid By :{" "}
              {formData.payee.length === 0 ? (
                <Paper onClick={handleOpenDialog}>Select User</Paper>
              ) : (
                formData.payee.map((payee) => (
                  <div key={payee.userID}>{payee.username}</div>
                ))
              )}
              <Payee open={openDialog} onClose={handleCloseDialog} users={users}/>
              
            </div>

            <br />
            <button type="submit" className="center">
              Submit
            </button>
          </form>
        </Paper>
      )}
    </>
  );
};

export default CreateExpense;
