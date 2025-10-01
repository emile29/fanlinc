import postSchema from './../models/post';
import { ObjectId } from 'mongodb';

class PostDBDriver {
	async getAllPosts(req, res) {
		try {
			const posts = await postSchema.find();
			res.status(200).json(posts);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async getAssociatedPosts(req, res) {
		try {
			const posts = await postSchema.find({
				fandom: req.params.fandom
			});
			if (!posts || posts.length === 0) {
				res.status(404).send("Post '" + req.params.fandom + "' not found");
			} else {
				res.status(200).json(posts);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async getPost(req, res) {
		try {
			const post = await postSchema.find({
				_id: ObjectId(req.params.id)
			});
			if (!post || post.length === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addPost(post, res) {
		try {
			const newPost = new postSchema(post.body);
			const savedPost = await newPost.save();
			res.status(200).send(savedPost);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deleteAll(req, res) {
		try {
			await postSchema.deleteMany({});
			res.status(200).send('deleted');
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async setNumVotes(req, res) {
		try {
			const post = await postSchema.updateOne(
				{_id: ObjectId(req.params.id)},
				{"numVotes": req.body.numVotes}
			);
			if (post.modifiedCount === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addComment(req, res) {
		try {
			const post = await postSchema.updateOne(
				{_id: ObjectId(req.params.id)},
				{$push: {"comments": {"comment":req.body.newComment, "author":req.body.author}}}
			);
			if (post.modifiedCount === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deletePost(req, res) {
		try {
			const post = await postSchema.deleteOne({_id: ObjectId(req.params.id)});
			if (post.deletedCount === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async updatePost(req, res) { //for all other fields that's not array
		try {
			const post = await postSchema.updateOne(
				{_id: ObjectId(req.params.id)},
				req.body
			);
			if (post.modifiedCount === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async setUserImage(req, res) {
		try {
			const post = await postSchema.updateOne(
				{_id: ObjectId(req.params.id)},
				{userImage: req.body.image}
			);
			if (post.modifiedCount === 0) {
				res.status(404).send("Post '" + req.params.id + "' not found");
			} else {
				res.status(200).send(post);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}
}

export default new PostDBDriver();
