import React from "react";
import "../styles/message.scss";

export const Message = (props) => {
    return (
        <div className="messageContainer">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <line className="messageStroke" stroke="#5fbcd3" strokeWidth="5px" 
                        x1="0" 
                        x2="100%" 
                        y1="0%" 
                        y2="0%" />
            </svg>
            <div className="messageBox">
                <div className="messageSender">{props.sender}</div>
                <div className="message">{props.message}</div>
            </div>

        </div>
    )
}