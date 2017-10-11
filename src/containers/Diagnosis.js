import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import {offerSymptoms, clearResults} from "../actions/diagnosisActions.js";
import SymptomColumn from "../components/SymptomColumn.js";
import "../styles/diagnosis.scss";


class Diagnosis extends React.Component {

    clearResults = (e) => {
        e.preventDefault();
        this.props.clearResults();
    }

    startDiagnosis = (e) => {
        e.preventDefault();
        let symptoms = e.target.symptomText.value;
        let age = e.target.age.value;
        let gender = e.target.gender.value; 
      
        if(symptoms.trim() !== ""){
            this.props.offerSymptoms(symptoms, age, gender);     //Queries the NLP endpoint of medical api to map given symptoms to known symptoms
        }
    
    }

    render() {
        return(
            <div className="diagnosisContainer">
               


                <form onSubmit={this.startDiagnosis}>
  
                    <div className="firstRow">
                        <div className="ageCon">
                        <div className="ageSingle">
                            <label>Age</label>
                            <input type="number" name="age" required min={5} max={99}/> 
                        </div>
                        <div className="ageLines">
                            <svg    
                            xmlns="http://www.w3.org/2000/svg" 
                            version="1.1">
                            
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="79.5%" 
                                x2="100%" 
                                y1="80%" 
                                y2="80%" 
                            />
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="50%" 
                                x2="80%" 
                                y1="10%" 
                                y2="80%" 
                            />
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="100%" 
                                x2="100%" 
                                y1="80%" 
                                y2="100%" 
                            />
                        </svg>
                            
                        </div>
                            
                        </div>
                        
                        <div className="genderCon">
                        <div className="genDouble">
                            <div className="genSingle">
                            <label>Male</label>
                            <input type="radio" value="male" name="gender" required/>
                    </div>
                            <div className="genSingle">
                            <label>Female</label>
                            <input type="radio" value="female" name="gender" required/>
                            </div>
                        </div>
                        <div className="genLines">
                            <svg    
                            xmlns="http://www.w3.org/2000/svg" 
                            version="1.1">
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="25%" 
                                x2="50%" 
                                y1="10%" 
                                y2="50%" 
                            />
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="75%" 
                                x2="50%" 
                                y1="10%" 
                                y2="50%" 
                            />
                            
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="50%" 
                                x2="50%" 
                                y1="50%" 
                                y2="81%" 
                            />
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="50%" 
                                x2="0%" 
                                y1="80%" 
                                y2="80%" 
                            />
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="0%" 
                                x2="0%" 
                                y1="80%" 
                                y2="100%" 
                            />
                        </svg>
                            
                        </div>
                        </div>
                    </div>
                    
                    <div className="secondRow">
                        <div className="symptoms">
                        <label>Symptoms</label>
                        <textarea type="text" name="symptomText" required></textarea>
                        </div>
                        <svg    
                            xmlns="http://www.w3.org/2000/svg" 
                            version="1.1">
                            <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="50%" 
                                x2="50%" 
                                y1="10%" 
                                y2="100%" 
                            />
                        </svg>
                        
                    </div>
                    
                    <div className="thirdRow">
                        <button type="submit">Start</button>
                    </div>
                    
                </form>



                {(!this.props.symptomsAvailable && !this.props.noResults) &&
                    <div className="consultHelp">
                    
                        <div className="helpItem">
                            <div className="help-ball"> 1 </div>
                            <div className="help-info">
                                <h3>Information</h3>
                                <p>
                                    Enter your age and gender.
                                </p>
                            </div>
                        </div>
    
                        <div className="helpItem">
                            <div className="help-ball"> 2 </div>
                            <div className="help-info">
                                <h3>Symptoms</h3>
                                <p>
                                    Enter any syptoms you have, if you want you can also include symptoms you don't have as well (this will help narrow down the diagnosis.
                                </p>
                            </div>
                        </div>
    
                        <div className="helpItem">
                            <div className="help-ball"> 3 </div>
                            <div className="help-info">
                                <h3>Diagnosis</h3>
                                <p>
                                    Press start and if you are happy with the syptoms listed, click next to continue. If you are not happy, rephrase your symptoms and try again.
                                </p>
                            </div>
                        </div>    
    
                    </div>
                }



                {this.props.noResults && 
                
                    <div className="consultHelp">
                        <div className="helpItem">
                            <div className="help-info">
                                <h3>No results</h3>                            
                                {this.props.rateLimit && <p>Api rate limit has been reached for the month.</p>}
                                {!this.props.rateLimit && <p>Try and rephrase your search.</p>}
                            </div>
                        </div>
                    </div>
                
                
                }



                {(this.props.symptomsAvailable && !this.props.noResults) &&
                <div className="initialSymptoms">
    
                    <h3>Symptoms</h3>

                    <div className="symptomTable">
                        <SymptomColumn status="present" symptoms={this.props.present}/>
                        <SymptomColumn status="absent" symptoms={this.props.absent}/>
                        <SymptomColumn status="unknown" symptoms={this.props.unknown}/>
                    </div>
                     
                    <div className="followOn">
                        <p>Sound good? Hit next</p>
                        <small>Note: Don't worry if this list isn't complete, follow up questions will be asked.</small>     
                            <Link to="/diagnosis/questions">
                                <button>Next</button>
                            </Link>
                 
                                                    
                        <p>If not, try and re-phrase your search term</p>
                    </div>
                


                </div>
                }

            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        mappedSymptoms: state.diagnosisReducer.mappedSymptoms,
        present: state.diagnosisReducer.present,
        absent: state.diagnosisReducer.absent,
        unknown: state.diagnosisReducer.unknown,
        laoding: state.diagnosisReducer.loading,
        symptomsAvailable: state.diagnosisReducer.symptomsAvailable,
        noResults: state.diagnosisReducer.noResults,
        age: state.diagnosisReducer.age,
        gender: state.diagnosisReducer.gender,
        rateLimit: state.diagnosisReducer.rateLimit
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        offerSymptoms: (symptoms, age, gender) => {
            dispatch(offerSymptoms(symptoms, age, gender))
        },
        clearResults : () => {
            dispatch(clearResults())
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Diagnosis);



