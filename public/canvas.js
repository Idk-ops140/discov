const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let room = '';

document.getElementById('join-room').addEventListener('click', () => {
  const roomInput = document.getElementById('room-input');
  room = roomInput.value.trim();
  if (room) {
    socket.emit('joinRoom', room);
    document.getElementById('room-container').style.display = 'none';
    canvas.style.display = 'block';
  }
});

canvas.addEventListener('mousedown', () => (drawing = true));
canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mouseout', () => (drawing = false));

canvas.addEventListener('mousemove', (event) => {
  if (!drawing) return;
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, 5, 5);

  // Emit draw event
  socket.emit('draw', { room, data: { x, y } });
});

// Receive drawing updates
socket.on('draw', (data) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(data.x, data.y, 5, 5);
});
