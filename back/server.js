const express = require('express');
const knex = require('knex');
const cors = require('cors');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db/database.sqlite'
  },
  useNullAsDefault: true
});

const app = express();
app.use(express.json());
app.use(cors());

// Create tables
db.schema.hasTable('tasks').then(exists => {
  if (!exists) {
    return db.schema.createTable('tasks', table => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.enum('status', ['Pendente', 'Em Andamento', 'Concluída']).defaultTo('Pendente');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
});

// Routes
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.select().from('tasks').orderBy('created_at', 'desc');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }
    
    const [task] = await db('tasks').insert({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'Pendente'
    }).returning('*');
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const updated = await db('tasks')
      .where({ id: req.params.id })
      .update({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      })
      .returning('*');
      
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await db('tasks').where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));