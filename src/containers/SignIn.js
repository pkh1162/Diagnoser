import React from "react";
import {handleSignIn, clearErrors} from "../actions/signInActions.js";
import {connect} from "react-redux";
import  { Link, Redirect } from "react-router-dom";
import "../styles/signIn.scss";

class SignIn extends React.Component {

    componentWillMount() {
        this.props.clearErrors();
    }

    handleBlur = (e) => {
        let field = e.target;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleSignIn(e.target);
    }


    render() {
        return (
            <div id="sign-in">
                
                <div className="signInContainer">
  
                    <div className="localStrategy">
                        <div className="bigSphere"><div className="littleSphere"></div></div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="formItem">
                                    <input 
                                        className="username_field" 
                                        onBlur={this.handleBlur} 
                                        onFocus={this.handleFocus} 
                                        name="usernameOrEmail" type="text" 
                                        placeholder="Enter Username"
                                    />
                                    <div className="formError">
                                        <p>{this.props.errors.usernameOrEmail && this.props.errors.usernameOrEmail.msg}</p>
                                        <p>{this.props.errors.userExists && this.props.errors.userExists.msg}</p>
                                    </div> 
                                </div>
                                
                                <div className="formItem">
                                    <input name="password" type="password" placeholder="Enter Password"/>
                                    <div className="formError">
                                        <p>{this.props.errors.password && this.props.errors.password.msg}</p>
                                        <p>{this.props.errors.userExists && this.props.errors.userExists.msg}</p>
                                    </div>  
                                </div>
                                
                                <div className="formItemButton">
                                    <input type="submit" value="submit"/>
                                    <div></div>
                                    <Link to="/signingUp"><button>sign up</button></Link>
                                </div>
                            </form>
                    </div>
                    
                    <div className="otherStrategy">
                        <div className="ballStrat">
                            <p>sign in with</p>
                        </div>
                        <svg 
                        className="connectingLineSignIn"   
                        xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="0%" 
                                x2="60%" 
                                y1="50%" 
                                y2="15%" 
                        />
                        
                        <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="60%" 
                                x2="95%" 
                                y1="15%" 
                                y2="15%" 
                        />
                        
                        <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="0%" 
                                x2="95%" 
                                y1="50%" 
                                y2="50%" 
                        />
                        <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="0%" 
                                x2="60%" 
                                y1="50%" 
                                y2="85%" 
                        />
                        
                        <line className="stroke-1" stroke="#5fbcd3" strokeWidth="5px" 
                                x1="60%" 
                                x2="95%" 
                                y1="85%" 
                                y2="85%" 
                        />
                            
                    </svg>
                        <div className="passportStrats">
                            <a className="strat" href="/api/githubAuth">Github</a>
                            <a className="strat" href="/api/slackAuth">Slack</a>
                            <a className="strat" href="/api/googleAuth">Google</a>
                        </div>
                    </div>
                    
                    
                    
                </div>




                {this.props.isAuth &&
                    <Redirect to={{
                        pathname: '/'
                }}/>
                }


                
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        errors: state.signInReducer.errors,
        isAuth: state.signInReducer.userSession
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleSignIn: (formData) => {
            dispatch(handleSignIn(formData))
        },
        clearErrors: () => {
            dispatch(clearErrors())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);