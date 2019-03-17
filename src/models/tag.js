import mongoose from 'mongoose';
import base from './base';

const tag = {
  ...Object.assign({}, base),
};

export default mongoose.model('tag', tag);
