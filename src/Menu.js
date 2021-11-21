import React from 'react';
import {Link} from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    return (
        <div className="Menu">
          <nav className="Menu-nav">
              <Link exact to="/integerop/add" className="Menu-link">
                  Adding Integers
              </Link>

              <Link exact to="/integerop/sub" className="Menu-link">
                  Subtracting Integers
              </Link>

              <Link exact to="/integerop/mult" className="Menu-link">
                  Multiplying Integers
              </Link>

              <Link exact to="/integerop/div" className="Menu-link">
                  Dividing Integers
              </Link>

              <Link exact to="/integerop" className="Menu-link Menu-link-mixed">
                  Mixed Practice
              </Link>
          </nav>
        </div>
    )
}

export default Menu;