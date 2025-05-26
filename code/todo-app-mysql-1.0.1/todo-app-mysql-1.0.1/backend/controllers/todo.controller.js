const { text } = require('express');

const TodoModel = require('../models').TodoModel;
const redisClient = require('../config/redis');

const TODO_CACHE_KEY = 'todo:all';

const TodoController = {
  createTodo: async (req, res) => {
    const user_id = req.sub;
    const { text, date } = req.body;
    await TodoModel.create({
      text: text,
      date: date,
      completed: false,
      user_id: user_id
    })
      .then((result) => {
        console.log('todo created : ', result);
        redisClient.del(TODO_CACHE_KEY);
        return res.status(201).json(result);
      })
      .catch((error) => {
        console.error('ADD TODO: ', error);
        return res.status(500);
      });
  },
  getAllTodo: async (req, res) => {
    const user_id = req.sub;
    try {
      const cachedTodos = await redisClient.get(TODO_CACHE_KEY);
      if (cachedTodos) {
        console.log('CACHE HIT');
        return res.status(200).json(JSON.parse(cachedTodos));
      }

      const result = await TodoModel.find({ user_id: user_id }, ['date', 'ASC']).select({
        user_id: 0,
        text: 1,
        date: 1,
        completed: 1
      });

      await redisClient.setEx(TODO_CACHE_KEY, 60, JSON.stringify(result));
      console.log('RESULT: ', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  editTodo: async (req, res) => {
    console.log('EDITING TODO');
    const user_id = req.sub;
    const query = { _id: req.params.id, user_id: user_id };
    const data = req.body;
    const result = await TodoModel.findOne(query);
    console.log('RESULT: ', result);
    if (result) {
      result.completed = data.completed ? data.completed : false;
      result.text = data.text ? data.text : result.text;
      result.date = data.date ? data.date : result.date;
      await result
        .save()
        .then(() => {
          redisClient.del(TODO_CACHE_KEY);
          return res.status(200).json(result);
        })
        .catch((error) => {
          console.error('UPDATE TODO: ', error);
          return res.status(500);
        });
    } else {
      return res.status(404);
    }
  },
  deleteTodo: (req, res) => {
    const user_id = req.sub;
    const todo_id = req.params.id;
    TodoModel.deleteOne({ _id: todo_id, user_id: user_id })
      .then(() => {
        console.log('TODO DELETED', todo_id);
        redisClient.del(TODO_CACHE_KEY);
        return res.status(200).json({ _id: todo_id });
      })
      .catch((error) => {
        console.error('DELETE TODO: ', error);
        return res.status(500);
      });
  },
  getSearchTodo: async (req, res) => {
    const user_id = req.sub;
    const query = req.query.q;
    await TodoModel.find({
      user_id: user_id,
      text: { $regex: query, $options: 'i' }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('SEARCH TODO: ', error);
        return res.status(500);
      });
  }
};
module.exports = TodoController;
