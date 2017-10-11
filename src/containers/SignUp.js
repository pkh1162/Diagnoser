import React from "react";
import {connect} from "react-redux";
import {signUp, updateFormErrors, handleSignUp} from "../actions/signUpActions.js";
import {clearErrors} from "../actions/signInActions.js";
import "../styles/signUp.scss";

class SignUp extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.clearErrors();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.handleSignUp(e.target);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.isAuth){
            //this.props.history.push("/home");
        }
        else {
        }

        return true;
    }

    render() {
        return (
            <div id="sign-up">

                <div className="signUpContainer">
  
                    <div className="localStrategy">
                        <div className="bigSphere"><div className="littleSphere"></div></div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="formItem">
                                    <input className="username_field" onBlur={this.handleBlur} onFocus={this.handleFocus} name="username" type="text" placeholder="Enter Username"/>
                                    <div className="formError">
                                        <p>{this.props.errors.username && this.props.errors.username.msg}</p>
                                        <p>{this.props.errors.userExists && this.props.errors.userExists.msg}</p>
                                        
                                    </div> 
                                </div>

                                <div className="formItem">
                                    <input name="email" type="text" placeholder="Enter email"/>
                                    <div className="formError">
                                        <p>{this.props.errors.email && this.props.errors.email.msg}</p>
                                        <p>{this.props.errors.userExists && this.props.errors.userExists.msg}</p>
                                                    
                                    </div> 
                                </div>
                                
                                <div className="formItem">
                                    <input name="password" type="password" placeholder="Enter Password"/>
                                    <div className="formError">
                                        <p>{this.props.errors.password && this.props.errors.password.msg}</p>
                                    </div>  
                                </div>


                                <div className="formItem">
                                    <input name="passwordMatch" type="password" placeholder="Re-type Password"/>
                                    <div className="formError">
                                        <p>{this.props.errors.passwordMatch && this.props.errors.passwordMatch.msg}</p>
                                    </div>  
                                </div>
                            
                                <div className="formItemButton">
                                    <input type="submit" value="submit"/>
                                </div>
                            </form>
                    </div>
                    
                    
                </div>




                    
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        username: state.signUpReducer.username,
        errors: state.signUpReducer.errors,
        isAuth: state.signInReducer.userSession
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleSignUp: (data) => {
            dispatch(handleSignUp(data))
        },
        signUp: (username, password) => {
            dispatch(signUp(username, password))
        },
        updateFormErrors: (errors) => {
            dispatch(updateFormErrors(errors));
        },
        clearErrors: () => {
            dispatch(clearErrors());
        }

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
