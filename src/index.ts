import { Server } from "./server";
import http from "http";
import { normalizePort, onError } from "./serverHandler";
import fs from 'fs';
import { CONFIG } from "./config/environment";
const SERVER = new Server();

const PORT = normalizePort(process.env.PORT || 3000);

SERVER.app.set("post", PORT);

let server = http.createServer(SERVER.app);


server.listen(PORT);

// server handler
server.on("error", error => onError(error, PORT));

server.on("listening", () => {
    const addr: any = server.address();
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

    console.log(`Listening on ${bind}`);
});

// Create uploads folder if does not exits
console.log(CONFIG.uploadsFolderPath, "CONFIG.uploadFolderPath");

if (!fs.existsSync(CONFIG.uploadsFolderPath)) {
    fs.mkdir(CONFIG.uploadsFolderPath, () => {
        console.log("upload folder created");
    })
} else {
    console.log("Uploads folders exists");
}


//Socket start here
let onlineUsers:any = {};
let users:any = {};
const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: `${process.env.FRONT_URL}`,
	},
});

io.on("connection", (socket:any) => {
	socket.on("setup", (userData:any) => {
		socket.join(userData?._id);

		// Add the user to the online users list
		onlineUsers[userData._id] = userData;

		// Send the updated list of online users to all clients
		// io.emit("onlineUsers", Object.values(onlineUsers));
		socket.emit("onlineUsers", Object.values(onlineUsers));

		socket.emit("connected");
	});

	socket.on("join chat", (room:any) => {
		console.log("Room Joined : ", room);
		socket.join(room);
	});

	socket.on("typing", (room:any) => socket.in(room).emit("typing"));
	// socket.on("onlineUsers", () => socket.emit('onlineUsers',Object.values(onlineUsers)));
	socket.on("stop typing", (room:any) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved:any) => {
		var chat = newMessageRecieved.chat;

		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((id:any) => {
			if (id == newMessageRecieved.sender._id) return;
			socket.in(id).emit("message recieved", newMessageRecieved);
		});
	});

	socket.on('online-users', (userId:any) => {
		users[userId] = { socketId: socket?.id, online: true, lastOnline: new Date() };
		console.log("uerId  ; ",userId);
		io.emit('user-status', users);
	})

	socket.emit('checkuseronline',users);

	socket.off("setup", (userData:any) => {
		socket.leave(userData?._id);
	});
});

//Socket Ends here