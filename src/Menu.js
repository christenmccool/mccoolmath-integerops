import React from 'react';
import {NavLink} from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    return (
        <nav className="Menu">
            <NavLink exact to="/integerop/add" className="Menu-link">
                Adding Integers
            </NavLink>

            <NavLink exact to="/integerop/sub" className="Menu-link">
                Subtracting Integers
            </NavLink>

            <NavLink exact to="/integerop/mult" className="Menu-link">
                Multiplying Integers
            </NavLink>

            <NavLink exact to="/integerop/div" className="Menu-link">
                Dividing Integers
            </NavLink>

            <NavLink exact to="/integerop" className="Menu-link Menu-link-mixed">
                Mixed Practice
            </NavLink>
        </nav>
    )
}

export default Menu;