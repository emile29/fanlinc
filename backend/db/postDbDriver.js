import postSchema from './../models/post';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

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
				_id: new ObjectId(req.params.id)
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
				{_id: new ObjectId(req.params.id)},
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

	async vote(req, res) {
		try {
			const id = new ObjectId(req.params.id);
			const { username, vote } = req.body; // vote: 'up' | 'down'
			if (!username) {
				return res.status(400).send('username required');
			}
			const post = await postSchema.findById(id);
			if (!post) {
				return res.status(404).send("Post '" + req.params.id + "' not found");
			}

			const existingIndex = post.votes ? post.votes.findIndex(v => v.user === username) : -1;
			const newVal = vote === 'up' ? 1 : (vote === 'down' ? -1 : 0);
			let delta = 0;

			if (existingIndex === -1) {
				// no existing vote
				if (newVal !== 0) {
					post.votes = post.votes || [];
					post.votes.push({ user: username, vote: newVal });
					delta = newVal;
				}
			} else {
				const existing = post.votes[existingIndex];
				if (newVal === 0) {
					// remove existing vote
					delta = -existing.vote;
					post.votes.splice(existingIndex, 1);
				} else if (existing.vote === newVal) {
					// toggle off
					delta = -existing.vote;
					post.votes.splice(existingIndex, 1);
				} else {
					// change vote
					delta = newVal - existing.vote; // e.g., -1 -> +1 === 2
					post.votes[existingIndex].vote = newVal;
				}
			}

			post.numVotes = (post.numVotes || 0) + delta;
			await post.save();
			return res.status(200).json(post);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addComment(req, res) {
		try {
			const post = await postSchema.updateOne(
				{_id: new ObjectId(req.params.id)},
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
			const post = await postSchema.deleteOne({_id: new ObjectId(req.params.id)});
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
				{_id: new ObjectId(req.params.id)},
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
				{_id: new ObjectId(req.params.id)},
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
