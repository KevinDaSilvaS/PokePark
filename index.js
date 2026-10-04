import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const server = createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html')); 
});

app.post('/create', (req, res) => {
    io.emit('create', {"name": "volbeat", "lastName": "shiny", "id": "oioioi", "eventId": "eventId"}); 
    res.send('ok')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});