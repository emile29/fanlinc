import { Schema, model } from 'mongoose';

const fandomSchema = new Schema({
	image : {
		type: String,
		default: "https://via.placeholder.com/100.jpg"
	},
	name : {
		type : String,
		required : true
	},
	description : {
		type : String,
		required : true
	},
	posts : [],
	subcount : {
		type : Number
	},
	admin : {
		type : String,
		required : true,
	},
	mods : [],
	events : []
});

export default model('fandom', fandomSchema);
