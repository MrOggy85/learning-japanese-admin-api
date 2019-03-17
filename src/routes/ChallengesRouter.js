import express from 'express';
import challenge from '../models/challenge';

import {
  asyncUtil,
  parseId,
  parseJson,
} from './helpers';

const ChallengesRouter = express.Router();

// Get all
ChallengesRouter.get('/', asyncUtil(async (req, res) => {
  const challenges = await challenge.find({}).exec();
  res.send(challenges);
}));

// Get by id
ChallengesRouter.get('/:id', asyncUtil(async (req, res) => {
  const id = parseId(req);
  const c = await challenge.findOne({ _id: id }).exec();
  res.send(c);
}));

// POST
ChallengesRouter.post('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  delete body._id;
  const c = await challenge.create(body);
  res.send(c);
}));

// PUT
ChallengesRouter.put('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  const id = body._id;
  delete body._id;
  const c = await challenge.update({ _id: id }, body);
  res.send(c);
}));

export default ChallengesRouter;
