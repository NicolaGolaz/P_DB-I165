/* const { Sequelize } = require('sequelize');

const TodoModel = require('../models').TodoModel;

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
        return res.status(201).json(result);
      })
      .catch((error) => {
        console.error('ADD TODO: ', error);
        return res.status(500);
      });
  },
  getAllTodo: async (req, res) => {
    const user_id = req.sub;
    await TodoModel.findAll({
      where: { user_id: user_id },
      order: [['date', 'ASC']],
      attributes: { exclude: ['user_id'] }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('GET ALL TODO: ', error);
        return res.status(500);
      });
  },
  editTodo: async (req, res) => {
    const user_id = req.sub;
    const query = { id: req.params.id, user_id: user_id };
    const data = req.body;
    const result = await TodoModel.findOne({ where: query });
    if (result) {
      result.completed = data.completed ? data.completed : false;
      result.text = data.text ? data.text : result.text;
      result.date = data.date ? data.date : result.date;
      await result
        .save()
        .then(() => {
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
    const query = { id: todo_id, user_id: user_id };
    TodoModel.destroy({
      where: query
    })
      .then(() => {
        return res.status(200).json({ id: todo_id });
      })
      .catch((error) => {
        console.error('DELETE TODO: ', error);
        return res.status(500);
      });
  },
  getSearchTodo: async (req, res) => {
    const user_id = req.sub;
    const query = req.query.q;
    await TodoModel.findAll({
      where: [
        {
          user_id: user_id
        },
        Sequelize.literal(`MATCH (text) AGAINST ('*${query}*' IN BOOLEAN MODE)`)
      ],
      order: [['date', 'ASC']],
      attributes: { exclude: ['user_id'] }
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

module.exports = TodoController; */

const { text } = require('express');

const TodoModel = require('../models').TodoModel;

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
        return res.status(201).json(result);
      })
      .catch((error) => {
        console.error('ADD TODO: ', error);
        return res.status(500);
      });
  },
  getAllTodo: async (req, res) => {
    console.log('GETTING ALL TODO');
    const user_id = req.sub;
    await TodoModel.find({ user_id: user_id }, ['date', 'ASC'])
      .select({ user_id: 0, text: 1, date: 1, completed: 1 })
      .then((result) => {
        if (result) {
          console.log('RESULT: ', result);
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('GET ALL TODO: ', error);
        return res.status(500);
      });
  },
  editTodo: async (req, res) => {
    const user_id = req.sub;
    const query = { id: req.params.id, user_id: user_id };
    const data = req.body;
    const result = await TodoModel.findOne({ where: query });
    if (result) {
      result.completed = data.completed ? data.completed : false;
      result.text = data.text ? data.text : result.text;
      result.date = data.date ? data.date : result.date;
      await result
        .save()
        .then(() => {
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
    TodoModel.deleteOne({ id: todo_id, user_id: user_id })
      .then(() => {
        console.log('TODO DELETED', todo_id);
        return res.status(200).json({ id: todo_id });
      })
      .catch((error) => {
        console.error('DELETE TODO: ', error);
        return res.status(500);
      });
  },
  getSearchTodo: async (req, res) => {
    const user_id = req.sub;
    const query = req.query.q;
    await TodoModel.findAll({
      where: [
        {
          user_id: user_id
        },
        Sequelize.literal(`MATCH (text) AGAINST ('*${query}*' IN BOOLEAN MODE)`)
      ],
      order: [['date', 'ASC']],
      attributes: { exclude: ['user_id'] }
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
