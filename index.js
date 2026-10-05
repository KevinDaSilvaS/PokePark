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

app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html')); 
});

app.post('/payload', (req, res) => {
  const body = req.body

  const { first_name, last_name } = body.event_profile.community_profile
  const { id, event_id } = body.event_profile
  switch (body.action) {
    case "profile_create":
      io.emit('create', {
        "name": first_name, 
        "lastName": last_name, 
        "id": id, 
        "eventId": event_id
      }); 
      break;
    case "profile_update":
      io.emit('update', {
        "name": first_name, 
        "lastName": last_name, 
        "id": id, 
        "eventId": event_id
      }); 
      break;
    case "profile_delete":
      io.emit('delete', {
        "name": first_name, 
        "lastName": last_name, 
        "id": id, 
        "eventId": event_id
      }); 
      break;
    default:
      break;
  }
  
  res.send('ok')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});