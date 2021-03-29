import React, { Component } from 'react';
import { MenuItems } from "./Menuitems"
import { Button } from "./Button"
import '../../css/Navbar.css';

import logo from '../../img/Porikkha_logo.png';

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    render() {
        return(

            <nav className="NavbarItems">
                <p className="navbar-logo">
                    <img src={logo} style={{width:'16%',marginLeft:'0px'}}/>
                </p>
                {/* <Button>Add New</Button> */}
            </nav>

        )
    }
}

export default Navbar