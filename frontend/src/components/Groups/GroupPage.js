import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios
import Loading from "../Loading";
import Expense from "./Expense";
import { Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupPage = (props) => {
  const { id } = useParams();
  const [group, setGroup] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Start with loading state true

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = `http://localhost:5555/groups/${id}`;
        const response = await axios.get(url);
        setGroup(response.data); // Set group to response.data instead of entire response
        setIsLoading(false); // Set loading state to false when data is fetched
      } catch (error) {
        console.log(error.message);
        setIsLoading(false); // Make sure to set loading state to false in case of error
      }
    };
    fetchData();
  }, [id]); // Include id in dependency array


  return (
    <div className="group-page center">
      {isLoading ? (
        <Loading />
      ) : (
        <>
        <div className="group-head-div center">
          <h1 className="group-head">{group.groupName}</h1>
          <Paper
          onClick={()=>{
            navigate(`/ShareWallet/expense/create/${group.groupID}`);
          }}
          style={{
            width: "fit-content",
            padding: "4px"
          }}>Add An Expense</Paper>
          </div>
          <div className="all-expenses center">
            {/* {console.log(group.users)} */}
            {/* {group.users.map((user)=>{
                return (<div key={user.userID} className="indi-user">{user.username}</div>)
            })} */}
            {group.expenses.map((expense)=>{
                return (<Expense expense ={expense}/>)
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default GroupPage;
