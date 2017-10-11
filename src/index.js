//import "./pop.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App.js";
import {BrowserRouter} from "react-router-dom";




import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer.js";

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
       </BrowserRouter>
    </Provider>, 
    document.querySelector("#root")
);
