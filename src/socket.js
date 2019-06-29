import Socket from "socket.io-client";


function getSocket(){

    const io = Socket('http://47.103.50.192:8000/');

    io.on("connect", () => {
        console.log("socket. 连接成功");
    });

    io.on("err", (m) => {
        alert(m);
    });

    return io;
}

var io = getSocket();
export default io;