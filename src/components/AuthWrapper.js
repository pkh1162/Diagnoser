import React from "react";
import {Redirect} from "react-router-dom";

export const AuthWrapper = (props) => {
    let  {redirection, componentName, isAuth} = props;
    const Component = componentName;
        if (isAuth){
            return <Component/>;
        }
        else {
            return <Redirect to={{pathname: redirection}}/>;
        }
    
}
    