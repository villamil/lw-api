const express = require('express');
const router = express.Router();

import { FlatsController } from '../controllers/flats.controller';

router.post('/', FlatsController.create);

export default router;

