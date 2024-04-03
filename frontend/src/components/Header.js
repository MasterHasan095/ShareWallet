import "../css/Header.css"
import React from "react";
import { Link } from "react-router-dom";

import Initials from "./Header/Initials";

const Header = () =>{
    return (
        <header>
            <h1>ShareWallet</h1>
            <nav >
                <Link to="/" className="white-text">Home</Link>
                <Link to="/profile" style={{textDecoration: "none"}}><Initials /></Link>
            </nav>
            
        </header>
    )
}

export default Header;