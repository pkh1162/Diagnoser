const mySockets = {};
const userSocket = [];
const doctorSockets = {};
const exportIO = {}
let socketSet = {};

let getIO = function(io){
    exportIO.io = io;
}

let ioConfig = function(io){

    io.on("connection", function(socket){
        exportIO.socket = socket;
        exportIO.io = io

        mySockets[socket.id] = socket;

    

        /*
            Fires when doctor accepts a consult invitation.
            Sets up chat room between doctor and patient  
        */
        socket.on("accept consult", function(data){
            let roomName = data.doctor.username + data.patient.username;
            let doctorSocket = mySockets[data.doctor.socketID];
            let patientSocket = mySockets[data.patient.socketID];

            doctorSocket.join(roomName);
            patientSocket.join(roomName);
            
            io.to(roomName).emit('consult connection', {roomName: roomName, docName: data.doctor.username});
        })


        
        /*
            Fires when message is sent between doctor and patient
        */
        socket.on("privatico message", function(data){
            io.to(data.roomName).emit('privatico receive', {
                roomName: data.roomName,
                message: data.message,
                senderName: data.senderName
            });
        })
        

        
        /* 
            Fires when doctor or patient in chat 
            starts typing.
        */
        socket.on("set typer", function(data){
            socket.to(data.roomName).broadcast.emit("someone typing", {
                typer: data.typerName
            })
        })



        /* 
            Fires when doctor or patient in chat 
            stops typing.
        */
        socket.on("remove typer", function(data){
            socket.to(data.roomName).broadcast.emit("someone stopped typing", {
                typer: data.typerName
            })
        })

       

        /*
            Fires when doctor or patient disconnects from
            chat room 
        */
        socket.on("chat disconnect", function(data){
            leaverSocket = mySockets[socket.id];
            io.to(data.roomName).emit("chat disconnected", {
                disconnector: data.disconnector
            })
            leaverSocket.leave(data.roomName);
        })




        /* 
            Fires when patient sends a diagnosis to the connected
            doctor.
        */
        socket.on("send diagnosis", function(data){
            io.to(data.roomName).emit('receive diagnosis', {
                roomName: data.roomName,
                diagnosis: data.diagnosis,
                senderName: data.senderName,
                conditions: data.conditions
            });
        })

        socket.on("fake diagnosis", function(data){
            socket.emit('receive diagnosis', {
                roomName: data.roomName,
                diagnosis: data.diagnosis,
                senderName: data.senderName,
                conditions: data.conditions
            });
        })


        /*
        
        */
        socket.on("base64", function(data){
            io.to(data.roomName).emit("receive image", {
                file: data.file,
                senderName: data.username,
                type: data.type,
                size: data.size,
                name: data.name
            })
        })

        socket.on("base64Fake",function(data){
            socket.emit("receive image", {
                file: data.file,
                senderName: data.username,
                type: data.type,
                size: data.size,
                name: data.name
            })
        })


        /*
            Fires when patient disconnects from
            chat room through refresh or on purpose
        */
        socket.on("user cancel consult", function(data){
            socket.broadcast.to(doctorSockets[data.doctor]).emit('user cancelled consult', data.disconnector);
        })
        

        /*
            Fires when user disconnects from socket.io, 
            either through refresh or when a user logs out
            of application. Consequently, list of doctors online
            is updated and event is sent to remaining sockets online.            
        */
        socket.on("disconnect", function(data){

            for(let doc in doctorSockets){
                if(doctorSockets[doc] === socket.id){
                    io.sockets.emit("update doc left", {
                        doctorName: doc
                    })
                }
            }
            
            io.sockets.emit("user leaving", {userID: socket.id})            
        })



        /*
            Fires when patient sends a consult request to a doctor.
            Doctors socket is retrieved and message is emitted to
            doctor concerned requesting a consult. The patient is
            also sent back the doctors socket for further use. 
        */
        socket.on("send consult request", function(data){
            data.docSocket = doctorSockets[data.doctorName];
            
            socket.broadcast.to(doctorSockets[data.doctorName]).emit('recieve doctor message', data);
            socket.emit('update requested doctor', doctorSockets[data.doctorName]);
        })


        socket.on("fake chat request", function(data){
            socket.emit('update requested doctor', doctorSockets[data.doctorName]);
            socket.emit('fake message', data);
        })

        


        /*
            Fires when a doctor's client application is refreshed or
            updated. Updates the doctorSockets object to ensure an
            accurate list of online doctors is available. 
        */
        socket.on("update socketID", function(data){
            //adds (key: doctor name, value: doctor socket) to doctorSockets object 
            doctorSockets[data.username] = socket.id;
        })
})


}


//socketSet is used to gain access to socket.io capabilities from outwith socket.js
socketSet = {
    ioConfig: ioConfig,
    mySockets: mySockets,
    doctorSockets: doctorSockets,
    exportIO: exportIO,
    getIO: getIO
}

module.exports = socketSet;

