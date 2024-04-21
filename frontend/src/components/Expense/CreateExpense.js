import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/form.css";
import { Paper } from "@mui/material";
import Loading from "../Loading";
import axios from "axios";
import Payee from "./Payee";
import Owee from "./Owee";
import IndiEclipseLook from "./IndiEclipseLook.js";
// Import useHistory hook from React Router

const CreateExpense = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [openDialogPayee, setOpenDialogPayee] = useState(false);
  const [openDialogOwee, setOpenDialogOwee] = useState(false);

  const [formData, setFormData] = useState({
    expenseName: "",
    amount: 0,
    typeOfSplit: "equally",
    payee: [],
    owee: [],
  });
  const [amount, setAmount] = useState(formData.amount);
  const [type, setType] = useState(formData.typeOfSplit);

  useEffect(() => {
    setAmount(formData.amount);
  }, [formData.amount]);

  useEffect(() => {
    // Reset the owee array when typeOfSplit changes
    setFormData((prevFormData) => ({
      ...prevFormData,
      owee: [], // Empty the owee array
    }));
    setType(formData.typeOfSplit);
  }, [formData.typeOfSplit]);

  const { id } = useParams();

  const handleOpenDialogPayee = () => {
    setOpenDialogPayee(true);
  };
  const handleCloseDialogPayee = (payees) => {
    formData.payee = payees;
    setOpenDialogPayee(false);
  };

  const handleOpenDialogOwee = () => {
    setOpenDialogOwee(true);
  };
  const handleCloseDialogOwee = (owees) => {
    formData.owee = owees;
    setOpenDialogOwee(false);
  };

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5555/groups/${id}/users`
        );
        setUsers(response.data.users);
        setIsLoading(false);
      };

      fetchUsers();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // If the event is from a checkbox input, handle the change in payee array
      if (checked) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: [...prevFormData[name], value],
        }));
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

  const submitForm = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Clicked Submit");
    // Add your form submission logic here
  }
  

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
                <Paper onClick={handleOpenDialogPayee}>Select User</Paper>
              ) : (
                <>
                  {formData.payee.map((payee) => (
                    <>
                      {/* <div key={payee.userID}>{payee.username}</div> */}

                      <IndiEclipseLook user={payee} />
                    </>
                  ))}

                  <Paper onClick={handleOpenDialogPayee}>Change Payees</Paper>
                </>
              )}
              <Payee
                open={openDialogPayee}
                onClose={handleCloseDialogPayee}
                users={users}
                totalAmount={amount}
                type={type}
              />
            </div>

            <div className="expense-owee-select">
              Split Between :{" "}
              {formData.owee.map((owee) => (
                <IndiEclipseLook user={owee} />
              ))}
              <Paper onClick={handleOpenDialogOwee}>Change owees</Paper>
              <Owee
                open={openDialogOwee}
                onClose={handleCloseDialogOwee}
                users={users}
                totalAmount={amount}
                type={type}
              />
            </div>

            <br />
            <button className="center" onClick={(event) => submitForm(event)}>
              Submit
            </button>
          </form>
        </Paper>
      )}
    </>
  );
};

export default CreateExpense;
