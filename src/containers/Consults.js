import React from "React";
import {connect} from "react-redux";
import "../styles/consults.scss";
import {retrieveDoctors} from "../actions/signInActions.js";
import {initSocket} from "../actions/socketActions.js";
import { addConsultRequest, removeConsultRequest, setPatientID} from "../actions/doctorActions.js";
//import  { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import {DoctorTag} from "../components/DoctorTag.js";
import ChatBubble from "./ChatBubble.js";
import {openClose, alterChannel, addMessage, initBubble, initRoom, fakeConnect} from "../actions/chatBubbleActions.js";

const io = require("socket.io-client");
const socket = io();    //---prod
//let socket = io.connect("http://localhost:3001"); //---dev



class Consults extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            socket: null
        }
    }

    

    componentWillReceiveProps(nextProps) {
        if(nextProps.username && nextProps.userType==="doctor"){
            this.state.socket.emit("update socketID", {
                username: this.props.username
            });
        
        }
    }

    componentWillMount() {
        this.props.getDoctors();        
        this.setState({
            socket
        })

      
        if(this.props.username && this.props.userType==="doctor"){
            socket.emit("update socketID", {
                username: this.props.username
            });
        }
        
        socket.on("recieve doctor message", (data) => {
            this.props.addConsult(data);
            
        })

        socket.on("user leaving", (data) => {
            if(this.props.userType === "user"){
                if(this.props.doctorID === data.userID){
                    
                    this.props.alterChannel("closed");
                    this.props.initBubble({
                        doctor: "diconnected",
                        patient: this.props.username
                    })
                    this.props.initRoom({
                        roomName: "",
                        connection: false
                    })

                }
                
            }
            else if (this.props.userType === "doctor"){
                if(data.userID === this.props.patientID){
                    this.props.alterChannel("closed");
                    this.props.initBubble({
                        doctor: this.props.username,
                        patient: "diconnected"
                    })
                    this.props.initRoom({
                        roomName: "",
                        connection: false
                    })
                }   

                this.props.removeConsultRequest(data.userID)
            }
            
            this.props.getDoctors();
            
        })

        socket.on("doctor leaving", () => {
            this.props.getDoctors();
        })

        socket.on("doctor entering", () => {
            this.props.getDoctors();
        })


        socket.on("consult connection", (data) => {
            this.props.alterChannel("connected");
            this.props.initRoom({
                roomName: data.roomName,
                connection: true
            })

            this.props.addMessage({
                message: "has joined the chat",
                senderName: data.docName,
                roomName: ""
            })
        })


    }
    
    sendDoctorMessage = (doctorName) => {
        if(!this.props.bubbleOpen){
            this.props.openClose();
        }
        
        this.props.alterChannel("request pending");
        this.props.initBubble({
            doctor: doctorName,
            patient: this.props.username
        })
        
        this.state.socket.emit("send consult request", {
            message: "this is a message to the doctor",
            doctorName: doctorName,
            mySocketId: this.state.socket.id,
            senderName: this.props.username
        })
        
    }


    fakeMessage = (doctorName) => {
        if(!this.props.bubbleOpen){
            this.props.openClose();
        }
        
        this.props.alterChannel("request pending");

        this.props.initBubble({
            doctor: doctorName,
            patient: this.props.username
        })


        setTimeout((e) => {
            this.props.alterChannel("connected");
            this.props.fakeConnect();


            this.state.socket.emit("fake chat request", {
                message: "This is just an example chat to let you see how it works. For two way chat, one of the doctors has to accept your request.",
                doctorName: doctorName,
                mySocketId: this.state.socket.id,
                senderName: this.props.username
            })
            
        }, 2000);
        
    }

    acceptConsult = (e) => {
        if(!this.props.bubbleOpen){
            this.props.openClose();
        }

        this.props.alterChannel("connected");
        this.props.initBubble({
            patient : e.target.textContent,
            doctor: this.props.username
        })

        // join room, need myID, yourID
        //find yourID
        let patientSocketID = "";
        this.props.consults.map(patient => {
            if(patient.senderName === e.target.textContent){
                patientSocketID = patient.mySocketId;
            }
        })

        this.props.setPatientID(patientSocketID);

        //emit joining event
        this.state.socket.emit("accept consult", {
            doctor: {
                username: this.props.username,
                socketID: this.state.socket.id
            },
            patient: {
                username: e.target.textContent,
                socketID: patientSocketID
            }
        })

        

    }
    
    render() {
        return (
            <div className="consults">
                
                <div className="right-bar">
                    <ChatBubble socket={this.state.socket} userType={this.props.userType} username={this.props.username}/>
                </div>

                <div className="consultItems">                    
                    
                    {this.props.userType === "doctor" 
                    &&
                    <div>
                        {
                            this.props.consults.map((consult, i) => {
                                return (
                                    <div onClick={this.acceptConsult} key={i}>
                                        <p>{consult.senderName}</p>
                                        <span>{consult.mySocketId}</span>
                                        <p></p>
                                    </div>
                                )
                            })
                        }

                        {this.props.diagnosis &&
                        <div>
                            {this.props.diagnosis.diagnosis && this.props.diagnosis.diagnosis.supporting_evidence.map((x,i) => {
                                return (
                                    <p key={i}>{x.name}</p>
                                )
                            })}

                        </div>
                        }

                    </div>
                    }
                    
                    {this.props.userType === "user" 
                    &&
                    <div>   
                    <DoctorTag key={"chattyKathy"} bubbleOpen={this.props.bubbleOpen} openChannel={this.fakeMessage} currentDoctor={this.props.currentDoctor} status={"active"} doctorName={"Justin X. Ample"}/>
                        {
                            this.props.doctors.map((doctor, i) => {
                                return <DoctorTag key={i} bubbleOpen={this.props.bubbleOpen} currentDoctor={this.props.currentDoctor} openChannel={this.sendDoctorMessage} status={doctor.status} doctorName={doctor.username}/>                                
                            })
                        }
    
                    </div>
                    
                    }
                    
                </div>
                <div className="consultHelp">
                
                    <div className="helpItem">
                        <div className="help-ball"> 1 </div>
                        <div className="help-info">
                            <h3>Request a Consult</h3>
                            <p>
                                Choose one of the active doctors and click connect.
                            </p>
                        </div>
                    </div>

                    <div className="helpItem">
                        <div className="help-ball"> 2 </div>
                        <div className="help-info">
                            <h3>Chat Connection</h3>
                            <p>
                                A consult request has been sent to the doctor. Wait, for the status to turn from "Request Pending" to "Connected".
                            </p>
                        </div>
                    </div>

                    <div className="helpItem">
                        <div className="help-ball"> 3 </div>
                        <div className="help-info">
                            <h3>Talk to the Doctor</h3>
                            <p>
                                Once connected you can chat to the doctor, send images, and if you have received a diagnosis from our diagnoser, you can send that to the doctor as well.
                            </p>
                        </div>
                    </div>

                    <div className="helpItem">
                        <div className="help-ball"> 4 </div>
                        <div className="help-info">
                            <h3>End Consult</h3>
                            <p>
                                Once you are finished, click disconnect to end the chat.
                            </p>
                        </div>
                    </div>


                </div>
              
            </div>
        )
    }
}



const mapStateToProps = (state, ownProps) => {
    return {
        userType: state.signInReducer.userType,
        consults: state.doctorReducer.consultRequests,
        doctors: state.signInReducer.doctors,
        currentDoctor: state.chatBubbleReducer.doctor,
        username: state.signInReducer.user.username,
        status: state.signInReducer.status,
        bubbleOpen: state.chatBubbleReducer.open,
        connection: state.chatBubbleReducer.connection,
        roomName: state.chatBubbleReducer.roomName,
        doctorID: state.chatBubbleReducer.doctorID,
        patientID: state.doctorReducer.patientID,
        diagnosis: state.doctorReducer.patientDiagnosis

    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addMessage: (data) => {
            dispatch(addMessage(data))
        },
        getDoctors: () => {
            dispatch(retrieveDoctors())
        },
        setSocket: (socket) => {
            dispatch(initSocket(socket))
        },
        addConsult: (consult) => {
            dispatch(addConsultRequest(consult))
        },
        removeConsultRequest: (userID) => {
            dispatch(removeConsultRequest(null, userID))
        },
        openClose: () => {
            dispatch(openClose());
        },
        alterChannel: (channelStatus) => {
            dispatch(alterChannel(channelStatus));
        },
        initBubble: (data) => {
            dispatch(initBubble(data))
        },
        initRoom: (data) => {
            dispatch(initRoom(data))
        },
        setPatientID: (data) => {
            dispatch(setPatientID(data))
        },
        fakeConnect: () => {
            dispatch(fakeConnect())
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Consults);