import express from 'express';
import tag from '../models/tag';

import {
  asyncUtil,
  parseId,
  parseJson,
} from './helpers';

const TagsRouter = express.Router();

// Get all
TagsRouter.get('/', asyncUtil(async (req, res) => {
  const tags = await tag.find({}).exec();
  res.send(tags);
}));

// Get by id
TagsRouter.get('/:id', asyncUtil(async (req, res) => {
  const id = parseId(req);
  const t = await tag.findOne({ _id: id }).exec();
  res.send(t);
}));

// POST
TagsRouter.post('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  delete body._id;
  const t = await tag.create(body);
  res.send(t);
}));

// PUT
TagsRouter.put('/', asyncUtil(async (req, res) => {
  const body = parseJson(req);
  const id = body._id;
  delete body._id;
  const t = await tag.update({ _id: id }, body);
  res.send(t);
}));

export default TagsRouter;
