import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import db from './utils/db.js'; //singleton prisma
import rateLimit from 'express-rate-limit'; //limit request
import DOMPurify from 'dompurify'; //sanitasi input
import Joi from 'joi'; //validasi input
import { JSDOM } from 'jsdom'; //sanitasi html

const app = express();
const PORT = 3000;

//sanitasi html
const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

//untuk menghidari spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(limiter);

// temp route buat nge test prisma
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

//schema untuk user id
const userIdSchema = Joi.number().integer().positive().required();
const emailSchema = Joi.string().email().required();

app.get('/api/user/:id', async (req, res) => {

  //validasi input
  const { error } = userIdSchema.validate(req.params.id);
  if(error){
    return res.status(400).json({ error: 'Invalid user ID' });
  }

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

app.post('/api/user/:id/change-email', async (req, res) => {
  //validasi input
  const { error: idError } = userIdSchema.validate(req.params.id);
  const { error: emailError } = emailSchema.validate(req.body.email);
  if (idError || emailError) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const userId = parseInt(req.params.id);
  const newEmail = req.body.email;

  //sanitasi
  // newEmail = purify.sanitize(newEmail);

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

app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); 

  const fileName = path.basename(req.query.name);
  const filePath = path.join(__dirname, 'files', fileName);

  //folder files itu permisalahn bolehnya buka folder itu
  if (!filePath.startsWith(path.join(__dirname, 'files'))) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});