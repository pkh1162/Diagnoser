import React from "react";
import "../styles/chatControls.scss";

export const ChatControls = (props) => {
    const sendImageCond = (!props.connection)
    const sendDiagnosisCond = (!props.diagnosis || !props.connection);
    const submitFunc = (props.doctor === "Justin X. Ample") ? props.fakeChat : props.submit;
    const attachImageFunc = (props.doctor === "Justin X. Ample") ? props.fakeImage : props.attachImage;
    const sendDiagnosisFunc = (props.doctor === "Justin X. Ample") ? props.fakeDiagnosis : props.sendDiagnosis;


    return (            
        <div className="chatTag">
        <form onSubmit={submitFunc} className="chatBox">
            <input onChange={props.setTyper} type="text" name="messageBox"/>
            <button disabled={sendImageCond} type="submit"> > </button>
            
        </form>
        <svg 
            className="preLine"   
            xmlns="http://www.w3.org/2000/svg" version="1.1">
            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="3px" 
                    x1="0" 
                    x2="95%" 
                    y1="35%" 
                    y2="0%" 
            />
            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="3px" 
                    x1="0" 
                    x2="95%" 
                    y1="55%" 
                    y2="100%" 
            />
                
        </svg>
        <div className="chatOptions">
          
            <input disabled={sendImageCond} className="sendImage" onChange={attachImageFunc} type="file" id="sendFile" accept="image/*"/>
            <label htmlFor="sendFile">image</label>
            <button  disabled={sendDiagnosisCond} onClick={sendDiagnosisFunc} className="sendDiagnosis">diagnosis</button>
            
        </div>
        </div>

    )
}

//{props.diagnosis && <button onClick={props.sendDiagnosis}>Send Diagnosis</button>}