import { Schema, model } from 'mongoose';

const postSchema = new Schema({
	tags : String,
	title: {
		type : String,
		required : true
	},
	content: {
		type : String,
	},
	image: {
		type : String,
	},
	author : {
		type : String
	},
	timestamp : {
		type : String
	},
	comments : [{
		type: Schema.Types.ObjectId,
		ref: 'comment'
	}],
	totalComments: {
		type: Number,
		default: 0
	},
	numVotes : {
		type : Number
	},
	fandom : {
		type : String,
		required : true
	},
	userImage : {
		type : String,
		required : true
	},
	votes : [{
		user: String,
		vote: Number // 1 for upvote, -1 for downvote
	}]
});

export default model('post', postSchema);
