import React from 'react';
import {NavLink} from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <div className="NavBar">
            <NavLink exact to="/" className="NavBar-link">McCool Math</NavLink>
        </div>
    )
}

export default NavBar;