import express from 'express';
import sentence from '../models/sentence';

import {
  asyncUtil,
  parseId,
  parseJson,
} from './helpers';

const SentencesRouter = express.Router();

// Get all
SentencesRouter.get('/', asyncUtil(async (req, res) => {
  const sentences = await sentence.find({}).exec();
  res.send(sentences);
}));

// Get by id
SentencesRouter.get('/:id', asyncUtil(async (req, res) => {
  const id = parseId(req);
  const sentences = await sentence.findOne({ _id: id }).exec();
  res.send(sentences);
}));

// POST
SentencesRouter.post('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  delete body._id;
  const createdSentence = await sentence.create(body);
  res.send(createdSentence);
}));

// PUT
SentencesRouter.put('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  const id = body._id;
  delete body._id;
  const createdSentence = await sentence.update({ _id: id }, body);
  res.send(createdSentence);
}));

export default SentencesRouter;
