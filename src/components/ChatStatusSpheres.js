import React from "react";
import "../styles/chatStatusSpheres.scss";

export const ChatStatusSpheres = (props) => {

    const requestLit = props.channelStatus === "request pending" ? "lit" : "unlit";
    const connectedLit = props.channelStatus === "connected" ? "lit" : "unlit";   
    const closedLit = props.channelStatus === "closed" ? "lit" : "unlit"; 


    const connectedAnimation = props.channelStatus === "connected" ? "connectIt" : "ll";    
    const closedAnimation = props.channelStatus === "closed" ? "connectIt" : "ll";

    let openThenClosed = "ll";
    if(props.connection){
         openThenClosed = props.channelStatus === "closed" ? "keepOn" : "ll";
    }
    
    

    return (
        <div className="chat-status-box">
            <p className="channel-status-bar">{props.channelStatus}</p>
            <div className="chat-status-container">
                <div id="chat-request" className={requestLit +" status-sphere "}></div>
                <svg 
                className="connectingDot"   
                xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <line className={openThenClosed + " tick-path " + connectedAnimation} stroke="#5fbcd3" strokeWidth="3px" 
                        x1="0" 
                        x2="100%" 
                        y1="50%" 
                        y2="50%" 
                    />
                    
                    
                </svg>
                <div id="chat-connected" className={connectedLit +" status-sphere "}></div>
                <svg 
                className="connectingDot"   
                xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <line className={"tick-path " + closedAnimation} stroke="#5fbcd3" strokeWidth="3px" 
                        x1="0" 
                        x2="100%" 
                        y1="50%" 
                        y2="50%" 
                    />
                </svg>
                <div id="chat-closed" className={closedLit +" status-sphere"}></div>

                
            </div>
            <button onClick={props.disconnect} className="channel-disconnect">Disconnect</button>
        </div>
      
    )
}
