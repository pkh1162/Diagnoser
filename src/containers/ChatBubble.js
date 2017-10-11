import React from "react";
import "../styles/chatBubble.scss";
import {connect} from "react-redux";
import {openClose, addMessage, addTyper, removeTyper, leaveChat, alterChannel, initBubble, initRoom, clearMessages, updateRequestedDoctor} from "../actions/chatBubbleActions.js";
import {removeConsultRequest, updateDiagnosis} from "../actions/doctorActions.js";
import {Message} from "../components/Message.js";
import {ChatControls} from "../components/ChatControls.js";
import {ChatStatusSpheres} from "../components/ChatStatusSpheres.js";


class ChatBubble extends React.Component {

    componentWillMount() {
       
        this.props.socket.on("privatico receive", (data) => {
            this.props.addMessage({
                message: data.message,
                senderName: data.senderName,
                roomName: data.roomName
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight

        })


        this.props.socket.on("fake message", (data) => {
            this.props.addMessage({
                message: data.message,
                senderName: data.senderName,
                roomName: data.roomName
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight

        })

        this.props.socket.on("someone typing", (data) => {
            this.props.addTyper(data.typer)
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
        })

        this.props.socket.on("someone stopped typing", (data) => {
            this.props.removeTyper(data.typer)
        })

        this.props.socket.on("user cancelled consult", (data) => {
            this.props.removeConsultRequest(data);
        })
        
        this.props.socket.on("update requested doctor", (data) => {
            this.props.updateRequestedDoctor(data);
        })

        this.props.socket.on("receive image", (data) => {
            this.props.addMessage({
                message: "Image sent",
                senderName: data.senderName,
                roomName: data.roomName,
                fileType: "image",
                file: data.file
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
            
        })

        this.props.socket.on("receive diagnosis", (data) => {
            this.props.addMessage({
                message: "diagnosis sent",
                senderName: data.senderName,
                roomName: data.roomName
            })
            if(this.props.userType === "doctor"){
                this.props.updateDiagnosis(data);
            }
            
        })


        this.props.socket.on("chat disconnected", (data) => {
            this.props.leaveChat();
            this.props.alterChannel("closed");
            this.props.removeConsultRequest(data.disconnector);
            this.props.addMessage({
                message: "has left the chat",
                senderName: data.disconnector,
                roomName: ""
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open !== this.props.open){
            document.querySelector(".chatBubble").classList.toggle("slide-in");
        }
    }


    submitMessage = (e) => {
        e.preventDefault();
        console.log("message being submitted real");

        if(e.target.messageBox.value){        
            this.props.socket.emit("remove typer", {
                    roomName: this.props.roomName,
                    typerName: this.props.username
            })
            
            this.props.socket.emit("privatico message", {
                roomName: this.props.roomName,
                message: e.target.messageBox.value,
                senderName: this.props.username
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
            e.target.messageBox.value = "";
        }    
        
        
    }


    fakeChat = (e) => {
        e.preventDefault();
        console.log("message being submitted fake");

        if(e.target.messageBox.value){            
            this.props.socket.emit("remove typer", {
                    roomName: this.props.roomName,
                    typerName: this.props.username
            })

            this.props.socket.emit("fake chat request", {
                roomName: this.props.roomName,
                message: e.target.messageBox.value,
                senderName: this.props.username
            })
            document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
            e.target.messageBox.value = "";
        }
    }

    scrollToBottom = (e) => {
        document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
    }

    setTyper = (e) => {
        if(e.target.value.length === 0){
            this.props.socket.emit("remove typer", {
                roomName: this.props.roomName,
                typerName: this.props.username
            })
        }
        else if(e.target.value.length === 3){
            this.props.socket.emit("set typer", {
                roomName: this.props.roomName,
                typerName: this.props.username
            })
        }
        
    }

    sendDiagnosis = () => {
        this.props.socket.emit("send diagnosis", {
            roomName: this.props.roomName,
            senderName: this.props.username,
            diagnosis: this.props.diagnosis,
            condition: this.props.conditions
        })
        document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
    }


    fakeDiagnosis = () => {
        this.props.socket.emit("fake diagnosis", {
            roomName: this.props.roomName,
            senderName: this.props.username,
            diagnosis: this.props.diagnosis,
            condition: this.props.conditions
        })
        document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
    }

    disconnect = (e) => {
        this.props.socket.emit("chat disconnect", {
            roomName: this.props.roomName,
            disconnector: this.props.username
        })
 
        this.props.socket.emit("user cancel consult", {
            doctor: this.props.doctor,
            disconnector: this.props.username
        })
        ///////////////////////////////////////////////
        if(this.props.userType === "doctor"){
            this.props.removeConsultRequest(this.props.patient)
        }

        this.props.updateDiagnosis(null)
        this.props.alterChannel("closed");
        this.props.initBubble({
            doctor: "",
            patient: ""
        })
        
        this.props.initRoom({
            roomName: "",
            connection: false
        })

        this.props.close()
        this.props.clearMessages();
        ///////////////////////////////////////////////

    }

    attachImage = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.readAsDataURL(file);
       
        reader.onload = (upload) => {
            var msg ={};
            msg.username = this.props.username;
            msg.file = upload.target.result;
            msg.type = file.type;
            msg.size = file.size;
            msg.name = file.name;
            msg.roomName = this.props.roomName
            this.props.socket.emit('base64', msg);
        }

        document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
          
    }


    fakeImage = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
    
        reader.readAsDataURL(file);
       
        reader.onload = (upload) => {
            var msg ={};
            msg.username = this.props.username;
            msg.file = upload.target.result;
            msg.type = file.type;
            msg.size = file.size;
            msg.name = file.name;
            msg.roomName = this.props.roomName
            this.props.socket.emit('base64Fake', msg);
        }

        document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
          
    }

    render() {
        return (
            <div className="chatBubble">
                <div className="chat-messages">
                {this.props.messages.map((message, i) => {
                    
                    if (message.fileType){
                        return (
                            <div className="imageContainer" key={i}>
                                <p>{message.senderName} <span>sent an image</span></p>
                                <img src={message.file}/>
                            </div>
                        )
                    }
                    else{
                        return (
                            <Message key={i} sender={message.senderName} message={message.message}/>
                        )
                    }
                    
                })}

                
                
            
                
                
                </div>
                <div className="someoneTypes">
                    {this.props.typers.length > 1 &&
                        <p className="is-typing">several people are typing</p>
                    }
                    {this.props.typers.length === 1 &&
                        <p className="is-typing">{this.props.typers[0]} is typing</p>
                    }
                </div>

                <ChatControls 
                    submit={this.submitMessage} 
                    setTyper={this.setTyper} 
                    connection={this.props.connection}
                    diagnosis={this.props.diagnosis}
                    sendDiagnosis={this.sendDiagnosis}
                    fakeDiagnosis={this.fakeDiagnosis}
                    attachImage={this.attachImage}
                    doctor={this.props.doctor}
                    fakeChat={this.fakeChat}
                    fakeImage={this.fakeImage}
                /> 
                    




                <ChatStatusSpheres connection={this.props.connection} disconnect={this.disconnect} channelStatus={this.props.channel}/>

            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    console.log("props in chatbubble: ", state);
    return {
        channel: state.chatBubbleReducer.channel,
        doctor: state.chatBubbleReducer.doctor,
        patient: state.chatBubbleReducer.patient,
        open: state.chatBubbleReducer.open,
        connection: state.chatBubbleReducer.connection,
        roomName: state.chatBubbleReducer.roomName,
        messages: state.chatBubbleReducer.messages,
        typers: state.chatBubbleReducer.typers,
        socket: ownProps.socket,
        username: ownProps.username,
        userType: ownProps.userType,
        diagnosis: state.questionsReducer.savedDiagnosis
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => {
            dispatch(openClose())
        },
        addMessage: (data) => {
            dispatch(addMessage(data))
        },
        addTyper: (data) => {
            dispatch(addTyper(data))
        },
        alterChannel: (channelStatus) => {
            dispatch(alterChannel(channelStatus));
        },
        initBubble: (data) => {
            dispatch(initBubble(data))
        },
        removeTyper: (data) => {
            dispatch(removeTyper(data))
        },
        leaveChat: () => {
            dispatch(leaveChat())
        },
        initRoom: (data) => {
            dispatch(initRoom(data))
        },
        clearMessages: () => {
            dispatch(clearMessages())
        },
        removeConsultRequest: (data) => {
            dispatch(removeConsultRequest(data))
        },
        updateRequestedDoctor: (data) => {
            dispatch(updateRequestedDoctor(data))
        },
        updateDiagnosis: (data) => {
            dispatch(updateDiagnosis(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBubble);


