const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const wsnotifications = {};

io.on("connection", socket => {
	let previousId;

	const safeJoin = currentId => {
		socket.leave(previousId);
		socket.join(currentId);
		previousId = currentId;
	};

	socket.on("addNotification", doc => {
		wsnotifications[doc.id] = doc;
		safeJoin(doc.id);
		io.emit("wsnotifications", Object.keys(wsnotifications));
		socket.emit("wsnotification", doc);
		socket.broadcast.emit("wsnotification", doc);
	});

	io.emit("wsnotifications", Object.keys(wsnotifications));
});


http.listen(4444);
console.log('==========================================================');
console.log('******** Socket Server is running port ', 4444, ' ********');
console.log('==========================================================');