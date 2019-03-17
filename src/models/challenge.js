import mongoose from 'mongoose';
import base from './base';

const challenge = {
  ...Object.assign({}, base),

  tags: { type: [String], default: [] },
  type: String,
};

export default mongoose.model('challenge', challenge);
