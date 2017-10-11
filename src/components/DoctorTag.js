import React from "react";
import "../styles/doctorTag.scss";

export const DoctorTag = (props) => {
    //const statusLight = props.status === "active" ? "active" : "INACTIVE";
    const isActive = props.status === "inactive" || props.status === "busy" ? true : false;
    let currentDoctor = props.currentDoctor === props.doctorName ? "lightUp" : "lll";
    let shiftLeft = props.currentDoctor === props.doctorName ? "shiftRight" : "lll";
    let channelOpen = props.bubbleOpen && props.currentDoctor !== props.doctorName || isActive ? true : false;

    return (        
        <div className={"doctorTag " + shiftLeft}>
            <svg 
                className="preLine"   
                xmlns="http://www.w3.org/2000/svg" version="1.1">
                <line className="stroke-1" stroke="#5fbcd3" strokeWidth="3px" 
                        x1="0" 
                        x2="105%" 
                        y1="25%" 
                        y2="6%" 
                />
                <line className="stroke-1" stroke="#5fbcd3" strokeWidth="3px" 
                        x1="0" 
                        x2="105%" 
                        y1="75%" 
                        y2="94%" 
                />
                    
            </svg>
            <div className="innerTag">
                <p className={"docName " + currentDoctor}>{props.doctorName}</p>
                <div className="docInfo">
                <div className="docStatus">
                    <p className={props.status + " " + "statusIndicator"}></p>
                    <p className="statusInfo">{props.status}</p>
                    
                    </div>
                <button disabled={channelOpen} onClick={() => props.openChannel(props.doctorName)} className="docConnect">connect</button>
                </div>
            </div>
        </div>
    )
}

