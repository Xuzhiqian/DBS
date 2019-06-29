import Socket from "socket.io-client";


function getSocket(){

    const io = Socket('http://localhost:8000/');

    io.on("connect", () => {
        console.log("socket. 连接成功");
    });

    return io;
}

var io = getSocket();
export default io;