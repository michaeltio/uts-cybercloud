import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import db from './utils/db.js';

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

// temp route
// app.get('/api/seed', async (req, res) => {
//   try {
//     await db.user.createMany({
//       data: [
//         { email: 'alice@example.com', name: 'Alice' },
//         { email: 'bob@example.com', name: 'Bob' },
//         { email: 'carol@example.com', name: 'Carol' },
//         { email: 'dave@example.com', name: 'Dave' },
//         { email: 'eve@example.com', name: 'Eve' },
//       ],
//     });
//     res.status(200).json({ message: 'Data seeded successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await db.user.findMany();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Route untuk mendapatkan pengguna berdasarkan ID
app.get('/api/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route untuk mengubah email pengguna berdasarkan ID
app.post('/api/user/:id/change-email', async (req, res) => {
  const userId = parseInt(req.params.id);
  const newEmail = req.body.email;
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Route untuk mengirim file
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); 

  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});