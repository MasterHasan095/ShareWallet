import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "../../css/Group.css";

const AllGroups = () => {
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    console.log("Checpoint 1");
    const fetchData = async () => {
      try {
        console.log("In here");
        const response = await fetch("http://localhost:5555/groups");
        const jsonData = await response.json();
        console.log(jsonData);
        setGroups(jsonData.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <h1>All Groups</h1>
      <Grid container spacing={2}>
        {console.log(groups)}
        {groups && groups.map((group) => (
          <Grid
            item
            key={group.id} // Add a unique key based on your data (e.g., group.id)
            sm={3}
            xs={3}
            md={3}
            lg={3}
            xl={3}
            className="group-grid"
          >
            <Paper elevation={3} className="group-paper">
              This is a paper
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AllGroups;
