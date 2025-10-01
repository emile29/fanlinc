import userSchema from './../models/user';

class UserDBDriver {
	async getAllUsers(req, res) {
		try {
			const users = await userSchema.find();
			res.status(200).send(users);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addUser(req, res) {
		try {
			const user = new userSchema(req.body);
			const savedUser = await user.save();
			res.status(200).send(savedUser);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async getUser(req, res) {
		try {
			const user = await userSchema.find({
				username: req.params.username,
				password: req.params.password
			});
			if (!user || user.length === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async getUserByUsername(req, res) {
		try {
			const user = await userSchema.find({
				username: req.params.username
			});
			if (!user || user.length === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async updateUser(req, res) { //for all other fields that's not array
		try {
			const user = await userSchema.updateOne({username: req.params.username}, req.body);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deleteUser(req, res) {
		try {
			const user = await userSchema.deleteOne({username: req.params.username, password: req.body.password});
			if (user.deletedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send('deleted');
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deleteAll(req, res) {
		try {
			await userSchema.deleteMany({});
			res.status(200).send('deleted');
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addFriend(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$push: {"profile.friends": req.body.friend}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addPending(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$push: {"profile.pending_friends": req.body.friend}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async removePending(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$pull: {"profile.pending_friends": req.body.friend}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async removeFriend(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$pull: {"profile.friends": req.body.friend}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async subscribe(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$push: {"profile.subscribed": req.body.fandom}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async unsubscribe(req, res) {
		try {
			const user = await userSchema.updateOne(
				{username: req.params.username},
				{$pull: {"profile.subscribed": req.body.fandom}}
			);
			if (user.modifiedCount === 0) {
				res.status(404).send("User '" + req.params.username + "' not found");
			} else {
				res.status(200).send(user);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}
}

export default new UserDBDriver();
