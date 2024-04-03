import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/form.css";
import { Paper } from "@mui/material";
// Import useHistory hook from React Router

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5555/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/ShareWallet/"); // Navigate to the home page
      } else {
        // If the request failed, handle the error
        console.error("Failed to create group:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating group:", error.message);
    }
  };

  return (
    <Paper elevation={3} className="form center">
      <form onSubmit={handleSubmit} className="center">
        <label>
          Group Name:
          <br />
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            placeholder="Enter Group Name"
            className="center"
          />
        </label>
        <br />
        <button type="submit" className="center">Submit</button>
      </form>
    </Paper>
  );
};

export default CreateGroup;
