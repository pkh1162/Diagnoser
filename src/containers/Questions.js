import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {diagnose, updateEvidence, saveDiagnosis} from "../actions/questionsActions.js";
import SymptomColumn from "../components/SymptomColumn.js";

import "../styles/questions.scss";


class Questions extends React.Component {

    componentWillMount = () => {
        this.props.diagnose(this.props.age, this.props.gender, this.props.evidence);
    }

    userResponse = (symptomID, choice_id) => {
     
        if(document.querySelector(".diagnosisSaved") && document.querySelector(".diagnosisSaved").classList.contains("fadeIn")){
            document.querySelector(".diagnosisSaved").classList.remove("fadeIn");
        }
        
        
        let newEvidence = [...this.props.evidence, {id:symptomID, choice_id}]
        this.props.updateEvidence(newEvidence)
        this.props.diagnose(this.props.age, this.props.gender, newEvidence)
    }

    saveDiagnosis = () => {
        this.props.saveDiagnosis(
            this.props.diagnosis, 
            this.props.evidence, 
            this.props.finalDiagnosis[0],
            this.props.gender,
            this.props.age
        );

        document.querySelector(".diagnosisSaved").classList.add("fadeIn");
    }

    render() {
        return(
            <div>
                <div>                    
                    <div className="interviewContainer">
                        <div className="interview">
                            <div className="question">
                                <span>Q</span>
                                <p>{this.props.question && this.props.question.text}</p>
                            </div>
                            <div className="answers">
                                {this.props.question && 
                                    this.props.question.items.map(item => item.choices.map((choice, i) => {
                                        return (
                                            <button className="answer" onClick={() => this.userResponse(item.id, choice.id)} key={i}>{choice.label}</button>
                                        )
                                    }))
                                }
 
                            </div>
                            
                        </div>
                        <div className="results">
                            <div className="diagnosisHeading">
                                {!this.props.diagnosisReached ?
                                    <p>Results</p>
                                    :
                                    <p>Final Diagnosis</p>                                
                                }
                                
                            </div>


                            <div className="diagnosisResults">
                                {!this.props.diagnosisReached && 
                                    <div className="resultContainer">
                                        {this.props.conditions &&  
                                            this.props.conditions.map((condition, i) => {
                                                return <div key={i}><p>{condition.name}</p><span>{Math.floor(condition.probability * 100)}%</span></div>
                                            }).filter((x,i) => i < 3)                                            
                                        }
                                    </div>
                                }


                                {this.props.diagnosisReached && 
                                    <div className="resultContainer">                            
                                        {this.props.finalDiagnosis && 
                                            this.props.finalDiagnosis.map((condition, i) => {
                                                return <div key={i}><p>{condition.name}</p><span>{Math.floor(condition.probability * 100)}%</span></div>
                                            })
                                        }
                                        <button onClick={this.saveDiagnosis}>Save diagnosis</button>
                                        <p className="diagnosisSaved"><i className="fa fa-check"></i></p>
                                    </div>
                                }            

                            </div>
                            




                        </div>
                    </div>
                    
                
                    <div>

                        
                    
                    </div>
                </div>

               


            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
        return {
        age: state.diagnosisReducer.age,
        gender: state.diagnosisReducer.gender,
        evidence: state.questionsReducer.evidence,
        question: state.questionsReducer.currentQuestion,
        diagnosis: state.questionsReducer.diagnosis,
        conditions: state.questionsReducer.diagnosis.conditions,
        finalDiagnosis: state.questionsReducer.finalDiagnosis,
        diagnosisReached: state.questionsReducer.diagnosisReached

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        diagnose: (age, gender, evidence) => {
            dispatch(diagnose(age, gender, evidence))
        },
        updateEvidence: (data) => {
            dispatch(updateEvidence(data))
        },
        saveDiagnosis: (conditions, evidence, diagnosis, gender, age) => {
            dispatch(saveDiagnosis(conditions, evidence, diagnosis, gender, age))
        }
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Questions);



