import userModel from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

module.exports = {
  create: (req, res, next) => {
    userModel.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      (err, result) => {
        if (err) next(err);
        else
          res.json({
            status: 'Success',
            message: 'User added successfully.',
            data: null,
          });
      },
    );
  },
  authenticate: (req, res, next) => {
    userModel.findOne({email: req.body.email}, (err, userInfo) => {
      if (err) {
        next(err);
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {
            expiresIn: '1h',
          });
          res.json({
            status: 'Success',
            message: 'User found.',
            data: {user: userInfo, token: token},
          });
        } else {
          res.json({
            status: 'Error',
            message: 'Invalid email or password.',
            data: null,
          });
        }
      }
    });
  },
};
