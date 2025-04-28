/* const bcrypt = require('bcrypt');
const UserModel = require('../models').UserModel;

const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.get({ plain: true });
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    await UserModel.create({
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 8)
    })
      .then((result) => {
        return res.status(201).json(cleanUser(result));
      })
      .catch((error) => {
        console.error('ADD USER: ', error);
        if (error && error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).json({
            message: 'Un compte avec cet email exist déjà !'
          });
        } else {
          return res.status(500);
        }
      });
  },
  getUser: async (req, res) => {
    const user_id = req.sub;
    await UserModel.findOne({
      where: { id: user_id },
      attributes: { exclude: ['id', 'password'] }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('GET USER: ', error);
        return res.status(500);
      });
  },
  editUser: async (req, res) => {
    const user_id = req.sub;
    const query = { id: user_id };
    const data = req.body;
    const user = await UserModel.findOne({ where: query });
    if (user) {
      user.name = data.name ? data.name : null;
      user.address = data.address ? data.address : null;
      user.zip = data.zip ? data.zip : null;
      user.location = data.location ? data.location : null;
      await user
        .save()
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((error) => {
          console.error('UPDATE USER: ', error);
          return res.status(500);
        });
    } else {
      return res.status(404);
    }
  },
  deleteCurrentUser: (req, res) => {
    const user_id = req.sub;
    const query = { id: user_id };
    UserModel.destroy({
      where: query
    })
      .then(() => {
        return res.status(200).json({ id: user_id });
      })
      .catch((error) => {
        console.error('DELETE USER: ', error);
        return res.status(500);
      });
  }
};

module.exports = UserController; */

const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = new UserModel({
        email: email.toLowerCase(),
        password: hashedPassword
      });
      const result = await newUser.save();
      return res.status(201).json(cleanUser(result));
    } catch (error) {
      console.error('ADD USER: ', error);
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'Un compte avec cet email existe déjà !'
        });
      } else {
        return res.status(500).json({ message: 'Erreur serveur' });
      }
    }
  },
  getUser: async (req, res) => {
    const user_id = req.sub;
    try {
      const result = await UserModel.findById(user_id).select('-_id -password');
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('GET USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  editUser: async (req, res) => {
    const user_id = req.sub;
    const data = req.body;
    try {
      const user = await UserModel.findById(user_id);
      if (user) {
        user.name = data.name ? data.name : null;
        user.address = data.address ? data.address : null;
        user.zip = data.zip ? data.zip : null;
        user.location = data.location ? data.location : null;
        const result = await user.save();
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('UPDATE USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  deleteCurrentUser: async (req, res) => {
    const user_id = req.sub;
    try {
      await UserModel.findByIdAndDelete(user_id);
      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error('DELETE USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};
module.exports = UserController;
