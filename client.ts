import WebSocket from 'ws';
import dnssd from 'dnssd';
import * as net from 'net';

const serviceType = 'one-quick';
const timeout = 5000; // Timeout for DNS-SD discovery in milliseconds

// Discover the WebSocket server using DNS-SD
const browser = new dnssd.Browser(dnssd.tcp(serviceType));
const timeoutId = setTimeout(() => {
  console.log(`Could not find ${serviceType} service.`);
  process.exit(1);
}, timeout);

browser.on('serviceUp', (service) => {
  if (service.name === serviceType) {
    console.log(`Found ${serviceType} service at ${service.addresses[0]}:${service.port}.`);
    clearTimeout(timeoutId);
    connectToServer(service);
  }
});

browser.start();

function connectToServer(service: any) {
  console.log(service.addresses);
  // Create a WebSocket client
  const address = service.addresses.find((addr: any) => net.isIPv4(addr));
  const socket = new WebSocket(`ws://${address}:${service.port}/ws`);

  // Listen for connection
  socket.on('open', () => {
    console.log(`Connected to WebSocket server at ${address}:${service.port}.`);

    // Send a message to the server
    socket.send('Hello, server!');

    // Listen for messages from the server
    socket.on('message', (message) => {
      console.log(`Received message from server: ${message}`);
      socket.send(`received: ${message}`)
    });

    // Listen for disconnection
    socket.on('close', () => {
      console.log('Disconnected from WebSocket server.');
      process.exit(0);
    });
  });

  // Listen for errors
  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error.message}`);
    process.exit(1);
  });
}
