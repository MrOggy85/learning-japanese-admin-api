import mongoose from 'mongoose';
import base from './base';

const sentence = {
  ...Object.assign({}, base),

  tags: { type: [String], default: [] },

  hint: String,
  en: String,
  ja: [String],
};

export default mongoose.model('sentence', sentence);
