import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: null
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    timestamp: {
        type: String,
        default: () => new Date().toISOString()
    }
});

export default model('comment', commentSchema);