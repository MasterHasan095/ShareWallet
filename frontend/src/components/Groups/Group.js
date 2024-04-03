import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../../css/Group.css";

const Group = (props) => {
  const [group, setGroup] = useState(props.group);

  return (
    <>
      <Link to={`/group/${group.groupID}`}>
        <Paper elevation={3} className="group-paper center">
          <h1>{group.groupName}</h1>
        </Paper>
      </Link>
    </>
  );
};
export default Group;
