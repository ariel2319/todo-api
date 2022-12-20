const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const PORT = 3000;

const app = express();

app.use(express.json()); // => tomo el archivo JSON y lo transforma en objeto o array...

const jsonPath = path.resolve('./files/tasks.json'); //tomar el JSON desde esta ruta..


//=> CREAR tareas en el TODO...
app.post('/tasks', async (req, res) => {
  const task = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({ ...task, id: newId });

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send('New user created successfully!');
})

//=> OBTENER las tareas del TODO...
app.get('/tasks', async (req, res) => {
  const jsonFIle = await fs.readFile(jsonPath, 'utf8');
  res.send(jsonFIle);
})

//=>ACTUALIZAR las tareas del TODO por ID...
app.put('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  //console.log(req.body);
  const { id, status } = req.body;

  const taskId = tasksArray.findIndex((task) => task.id === id);


  //asignar los nuevos datos si el ID es posible
  if (taskId >= 0) {
    tasksArray[taskId].status = status;
  }

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send('Task update successfully');
})

//=>ELIMINAR tareas del TODO..
app.delete('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const { id } = req.body;
  const taskId = tasksArray.findIndex((task) => task.id === id);

  tasksArray.splice(taskId, 1); //=> eliminar el registro por ID

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send('Task Delete successfully');
})



app.listen(PORT, () => {
  console.log(`ya está ready el server ${PORT} pa :)`)
})