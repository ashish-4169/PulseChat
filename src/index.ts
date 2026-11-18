import {
    OutgoingMessage,
    SupportedMessage as OutgoingSupportedMessages
} from "./messages/outgoingMessages";

import { WebSocketServer, WebSocket } from "ws";
import http from "http";

import { UserManager } from "./UserManager";
import {
    IncomingMessage,
    SupportedMessage
} from "./messages/incomingMessages";

import { InMemoryStore } from "./store/InMemoryStore";

const server = http.createServer((request, response) => {
    console.log(new Date() + " Received request for " + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

const wsServer = new WebSocketServer({
    server: server
});

wsServer.on("connection", (ws: WebSocket) => {
    console.log("Connection accepted.");

    ws.on("message", (data) => {
        try {
            const message: IncomingMessage = JSON.parse(data.toString());
            messageHandler(ws, message);
        } catch (error) {
            console.error("Invalid message received:", error);
        }
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

function messageHandler(ws: WebSocket, message: IncomingMessage) {

    if (message.type === SupportedMessage.JoinRoom) {
        const payload = message.payload;

        userManager.addUser(
            payload.name,
            payload.userId,
            payload.roomId,
            ws
        );
    }

    if (message.type === SupportedMessage.SendMessage) {
        const payload = message.payload;

        const user = userManager.getUser(
            payload.roomId,
            payload.userId
        );

        if (!user) {
            console.error("User not found in the db");
            return;
        }

        const chat = store.addChat(
            payload.userId,
            user.name,
            payload.roomId,
            payload.message
        );

        if (!chat) {
            return;
        }

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        };

        userManager.broadcast(
            payload.roomId,
            payload.userId,
            outgoingPayload
        );
    }

    if (message.type === SupportedMessage.UpvoteMessage) {
        const payload = message.payload;

        const chat = store.upvote(
            payload.userId,
            payload.roomId,
            payload.chatId
        );

        if (!chat) {
            return;
        }

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        };

        userManager.broadcast(
            payload.roomId,
            payload.userId,
            outgoingPayload
        );
    }
}

if (require.main === module) {
    server.listen(8080, () => {
        console.log("Server is listening on port 8080");
    });
}

export default server;