import React from "react";
import Consults from "./Consults.js";
import Header from "../components/Header.js";
import HomePage from "../components/HomePage.js";
import Questions from "./Questions.js";
import {Footer} from "../components/Footer.js";
import SignUp from "./SignUp.js";
import {AuthWrapper} from "../components/AuthWrapper.js";
import SignIn from "./SignIn.js";
import "../styles/app.scss";
import Diagnosis from "./Diagnosis.js";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import  { runAuthCheck, logout } from "../actions/authActions.js";
import {retrieveDoctors} from "../actions/signInActions.js";



import  { Route, NavLink, Switch } from "react-router-dom";

class App extends React.Component {

    componentWillMount() {
        this.props.runAuthCheck();  
        this.props.getDoctors();
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <div className="">
                {this.props.connectionOpen &&
                    <div className="overlayer"></div>
                }
                <Header handleLogout={this.props.logout} privilege= {this.props.userType} isAuth={this.props.isAuth} />
               
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/diagnosis" component={Diagnosis}/>
                    <Route exact path="/diagnosis/questions" component={Questions}/> 
                    <Route exact path="/consults" component={Consults}/>                  
                    <Route path="/signingIn" component={SignIn}/>
                    
                    <Route path="/signingUp" render={() => {
                        return (
                            <AuthWrapper componentName={SignUp} isAuth={!this.props.isAuth} redirection="/"/>
                        )
                    }} />
                    
                    <Route render={() => {
                        return <h1>404</h1>
                    }}/>
               </Switch>

               <Footer />
            </div>
        
    )
    }
    
} 


const mapStateToProps = (state, ownProps) => {
    return {
        isAuth: state.signInReducer.userSession,
        user: state.signInReducer.user,
        userType: state.signInReducer.userType,
        savedDiagnosis: state.questionsReducer.savedDiagnosis,
        connectionOpen: state.chatBubbleReducer.open
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        runAuthCheck: () => {
            dispatch(runAuthCheck())
        },
        logout: () => {
            dispatch(logout())
        },
        getDoctors: () => {
            dispatch(retrieveDoctors())
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));