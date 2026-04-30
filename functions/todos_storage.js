import fs, { writeFile, readFile } from 'node:fs/promises';
const path = 'storage/todos.json'; // ch emin vers le fichier de stockage
import { NotFoundError } from './api/error.js';
export async function findTodos() {
  /**
   * @typedef {object} Todo;
   * @property {number} id;
   * @property {string} title;
   * @property {boolean} completed;
   */

  /**
   *@returns {Promise<Todo[]>}
   */
  const data = await fs.readFile(path, 'utf8');
  return JSON.parse(data);
}

/**
 *@param {string} todo.title
 *@param {boolean} todo.completed
 *@returns {Promise<Todo>}
 */
export async function createTodo({ title, completed = false }) {
  const todo = { title, completed, id: Date.now() };
  const todos = [todo, ...(await findTodos())];
  await writeFile(path, JSON.stringify(todos, null, 2));
  return todo;
}

/**
 *@param {string} todo.title
 *@param {boolean} todo.completed
 *@returns {Promise<Todo>}
 */
export async function removeTodo({ id }) {
  let todos = await findTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    throw new NotFoundError('Todo not found');
  }
  await writeFile(
    path,
    JSON.stringify(
      todos.filter((todo) => todo.id !== id),
      null,
      2,
    ),
  );
  return todos;
}

/**
 *@param {number} id
 *@param {object} partialTodo
 *@param {string} partialTodo.title optional default undefined
 *@param {boolean} partialTodo.completed optional default undefined default false
 *@returns {Promise<Todo>} optional default undefined
 */
export async function updateTodo(id, partialTodo) {
  const todos = await findTodos();
  const todo = todos.find((todo) => todo.id === id);
  if (todo === undefined) {
    throw new NotFoundError('Todo not found');
  }

  Object.assign(todo, partialTodo);
  await writeFile(path, JSON.stringify(todos, null, 2));
  return todo;
}

// test
