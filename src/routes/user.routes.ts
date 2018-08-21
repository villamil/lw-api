const express = require('express');
const router = express.Router();

import { UserController } from '../controllers/user.controller';

router.post('/', UserController.create);

export default router;

