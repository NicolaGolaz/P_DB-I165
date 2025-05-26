const mongoose = require('mongoose');
const { Schema } = mongoose;
const TodoSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

TodoSchema.index({ text: 'text' });

module.exports = mongoose.model('Todo', TodoSchema);
