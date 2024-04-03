import React, {useState} from "react";
import { useParams } from "react-router-dom";
const GroupPage = (props) =>{

    const {id} = useParams();
    // const [group, setGroup] = useState(props.group);

    return (
        <div>
            This is indi group: {id}
        </div>
    )
}

export default GroupPage;