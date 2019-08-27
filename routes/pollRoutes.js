const express = require('express');
const router = express.Router();

const pollController = require('../controllers/pollController');

const authMiddleWare = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(pollController.getAllPolls)
  .post(authMiddleWare, pollController.createPoll);

router.get('/user', authMiddleWare, pollController.usersPoll);

router
  .route('/:id')
  .get(pollController.getPoll)
  .put(authMiddleWare, pollController.votePoll)
  .delete(authMiddleWare, pollController.deletePoll);

module.exports = router;
