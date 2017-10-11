import React from "react";
import "../styles/homePage.scss";
import banner from "../assets/images/doctors.jpg";
import  { BrowserRouter, Route, NavLink, Switch } from "react-router-dom";


const HomePage = () => {
    return (
        <div className="homePage">
            <div className="banner">
                <div className="overlay">
                    <p>Diagnoser</p>
                </div>
            </div>

            <div className="featureList">
                <div className="symptomFeature">
                    <div className="featureHeading">

                    <NavLink exact activeClassName="active" to="/diagnosis">
                        <i className="fa fa-stethoscope"></i>
                        <h3>Diagnoser</h3> 
                    </NavLink>

                    
                    <p>Use our diagnoser feature, which takes advantage of the Infermedica api, to give you a probability based diagnosis based upon entered sypmtoms.</p>
                    </div>
                </div>
                <div className="consultsFeature">
                    <div className="featureHeading">
                        <NavLink exact activeClassName="active" to="/consults">
                            <i className="fa fa-stethoscope"></i>
                            <h3>Live Consult</h3> 
                        </NavLink>     
                    </div>

                    <div className="featureBubbles"> 
                        <div>
                            <i className="fa fa-ambulance"></i>
                            <p>Request a consult</p>
                        </div>
                        <div>
                            <i className="fa fa-user-md"></i>
                            <p>Live chat with doctor</p>
                        </div>
                        <div>
                            <i className="fa fa-heart"></i>
                            <p>Confirm diagnosis</p>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>
    )
}

export default HomePage;