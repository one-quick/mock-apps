import * as WebSocket from 'ws';
import dnssd from 'dnssd';

const port = 8080;

// Create a WebSocket server
const server = new WebSocket.Server({ port });

// Create a mDNS advertisement
const ad = new dnssd.Advertisement(dnssd.tcp('one-quick'), port);
ad.start();

// Listen for WebSocket connections
server.on('connection', (socket: WebSocket) => {
  console.log('Client connected.');

  // Send a message to the client
  
  // Listen for messages from the client
  socket.on('message', (message: string) => {
    console.log(`Received message from client: ${message}`);
    setInterval(() => {
      socket.send("Hellooo")
    }, Math.random() * 10000)
  });

  // Listen for disconnection
  socket.on('close', () => {
    console.log('Client disconnected.');
  });
});

console.log(`WebSocket server running on port ${port}.`);
