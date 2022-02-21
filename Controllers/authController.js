const pool = require('../db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };

  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '24h' });
};

class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      const { username, password } = req.body;

      // My own validation
      // if (!username || !password) {
      //   let errors = [];
      //   if (!username) errors.push({ msg: 'Please enter username' });
      //   if (!password) errors.push({ msg: 'Please enter password' });
      //   return res.status(400).json({ errors });
      // }
      //

      const candidate = await pool.query('SELECT * from users where  username = $1', [username]);
      if (candidate.rows.length) {
        return res.status(400).json({ msg: 'There is an account with that username' });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const user = await pool.query(
        'insert into users (username, password, role) values ($1, $2, 1) RETURNING *;',
        [username, hashPassword],
      );
      console.log(user);
      return res.status(200).json({ msg: ' Successfully registered', user: user.rows[0] });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await pool.query('select * from users where username = $1', [username]);
      if (!user.rows[0])
        return res.status(400).json({ msg: `User with username ${username} not found` });

      const validPassword = bcrypt.compareSync(password, user.rows[0].password);

      // console.log(validPassword);
      if (!validPassword) return res.status(400).json({ msg: `Wrong password` });

      const token = generateAccessToken(user.rows[0].user_id, user.rows[0].role);

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await pool.query(
        'select user_id, username, rolname from users inner join roles on users.role = roles.role_id;',
      );
      res.status(200).json({ users: users.rows });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new authController();
