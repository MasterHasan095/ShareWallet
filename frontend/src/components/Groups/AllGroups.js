import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Loading from "../Loading";
import Group from "./Group";
import { Link } from "react-router-dom";
import "../../css/Group.css";

const AllGroups = () => {
  const [groups, setGroups] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Checpoint 1");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("In here");
        const response = await fetch("http://localhost:5555/groups");
        const jsonData = await response.json();
        console.log(jsonData);
        setGroups(jsonData.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="center">
      <h1>All Groups</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container spacing={2} className="group-container center">
          {groups &&
            groups.map((group) => (
              <Grid
                item
                key={group.id} // Add a unique key based on your data (e.g., group.id)
                sm={3}
                xs={3}
                md={3}
                lg={3}
                xl={3}
                className="group-grid center"
              >
                <Group group={group} />
              </Grid>
            ))}
        </Grid>
      )}
      <div className="center" >
        <Link to="/ShareWallet/group/create" className="white-text center" style={{textDecoration: "none"}}>
          <Paper elevation={3} className="create-button center" style={{marginLeft: "35vw"}} >
            Create a Group
          </Paper>
        </Link>
      </div>
    </div>
  );
};

export default AllGroups;
