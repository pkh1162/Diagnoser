import React from "react";

const SymptomColumn = (props) => {
    return (
        <div className="symptomColumn">
        <h4>{props.status}</h4>
        
        {props.symptoms.map((symptom, i) => {
            return <p key={i}>{symptom.common_name}</p>
        })}

        </div>
    )
}

export default SymptomColumn;