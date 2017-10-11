import React from "react";
import  { BrowserRouter, Route, NavLink, Switch } from "react-router-dom";
import "../styles/header.scss";

const Header = (props) => {
    let home = props.userType === "user" ? "Home" : "Home"; 
    return (
            <nav>
                <div className="navoids">
                <NavLink exact activeClassName="active" to="/">
                    <span className="big-nav">Home</span>
                    <span className="small-nav"><i className="fa fa-home"></i></span>
 
                </NavLink>

                {props.isAuth &&
                    
                        <NavLink activeClassName="active" to="/diagnosis">
                            <span className="big-nav">Diagnoser</span>
                            <span className="small-nav"><i className="fa fa-ambulance"></i></span>
                        </NavLink>
                    
                }
                
                {props.isAuth &&
                
                    <NavLink exact activeClassName="active" to="/consults">
                        <span className="big-nav">Consults</span>
                        <span className="small-nav"><i className="fa fa-user-md"></i></span>
 
                    </NavLink>
                }

                </div>

                <div className="logoids">
                {props.isAuth ?
                    <NavLink activeClassName="active" onClick={props.handleLogout} to="/">
                        <span className="big-logoid">Logout</span>
                        <span className="small-logoid">Logout</span>                    
                    </NavLink>
                    :
                    <NavLink activeClassName="active" to="/signingIn">
                        <span className="big-logoid">Sign In</span>
                        <span className="small-logoid">Sign In</span>
                    </NavLink>
                }
                </div>
                
            </nav>
    )
}

export default Header;