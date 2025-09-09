import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendMessage } from './controllers/chatController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', sendMessage);

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo desde el servidor Express!' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});