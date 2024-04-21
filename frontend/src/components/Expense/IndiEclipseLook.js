import React, {useState} from "react";
import "../../css/expense.css";

const IndiEclipseLook = (props) => {

    const [username, setUsername] = useState(props.user.username);
    const [amount, setAmount] = useState(props.user.amount);

    return (
        <div className="oval center">
            <p className="oval-username">{username}</p> : 
            <p className="oval-amount">{amount}</p>
        </div>
    )
}

export default IndiEclipseLook;