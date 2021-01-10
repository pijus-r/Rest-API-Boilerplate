import express from 'express';
import userController from '../app/api/controllers/users';

const router = express.Router();

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);

module.exports = router;
