import postSchema from './../models/post';
import commentSchema from './../models/comment';
import userSchema from './../models/user';
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
			const post = await postSchema.findById(new ObjectId(req.params.id))
				.populate({
					path: 'comments',
					populate: [
						{ path: 'author', select: 'username image' },
						{ path: 'replies', populate: [
							{ path: 'author', select: 'username image' },
							{ path: 'replies', populate: [
								{ path: 'author', select: 'username image' },
								{ path: 'replies', populate: { path: 'author', select: 'username image' } }
							] }
						] }
					]
				});
			if (!post) {
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
			const postId = new ObjectId(req.params.id);
			const { newComment, author, parentCommentId } = req.body;
			if (!newComment || !author) {
				return res.status(400).send('newComment and author are required');
			}

			// create the comment document
			// resolve author: allow either ObjectId string or username
			let authorIdObj;
			if (ObjectId.isValid(author)) {
				authorIdObj = new ObjectId(author);
			} else {
				const user = await userSchema.findOne({ username: author });
				if (!user) return res.status(404).send("Author user '" + author + "' not found");
				authorIdObj = user._id;
			}

			const commentDoc = new commentSchema({
				content: newComment,
				author: authorIdObj,
				post: postId,
				parentComment: parentCommentId ? new ObjectId(parentCommentId) : null
			});
			const savedComment = await commentDoc.save();

			if (parentCommentId) {
				// it's a reply to another comment
				const parentUpdate = await commentSchema.updateOne(
					{_id: new ObjectId(parentCommentId)},
					{$push: { replies: savedComment._id }}
				);
				if (parentUpdate.modifiedCount === 0) {
					// parent not found
					return res.status(404).send("Parent comment '" + parentCommentId + "' not found");
				}
				// increment post totalComments
				await postSchema.updateOne({_id: postId}, {$inc: { totalComments: 1 }});
			} else {
				// top-level comment on the post
				const postUpdate = await postSchema.updateOne(
					{_id: postId},
					{$push: { comments: savedComment._id }, $inc: { totalComments: 1 }}
				);
				if (postUpdate.modifiedCount === 0) {
					return res.status(404).send("Post '" + req.params.id + "' not found");
				}
			}

			return res.status(200).json(savedComment);
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
