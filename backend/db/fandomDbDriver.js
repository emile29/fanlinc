import fandomSchema from './../models/fandom';

class FandomDBDriver {
	async getAllFandoms(req, res) {
		try {
			const fandoms = await fandomSchema.find();
			res.status(200).json(fandoms);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async getFandom(req, res) {
		try {
			const fandom = await fandomSchema.find({name: req.params.name});
			if (!fandom || fandom.length === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async addFandom(fandom, res) {
		try {
			const newFandom = new fandomSchema(fandom.body);
			const savedFandom = await newFandom.save();
			res.status(200).send(savedFandom);
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async updateFandom(req, res) { //for all other fields that's not array
		try {
			const fandom = await fandomSchema.updateOne(
				{name: req.params.name},
				req.body
			);
			if (fandom.modifiedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(404).send(err.message);
		}
	}

	async setPosts(req, res) {
		try {
			const fandom = await fandomSchema.updateOne(
				{name: req.params.name},
				{$push: {"posts": req.body.newPost}}
			);
			if (fandom.modifiedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async setMods(req, res) {
		try {
			const fandom = await fandomSchema.updateOne(
				{name: req.params.name},
				{$push: {"mods": req.body.newMod}}
			);
			if (fandom.modifiedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async setEvents(req, res) {
		try {
			const fandom = await fandomSchema.updateOne(
				{name: req.params.name},
				{$push: {"events": req.body.newEvent}}
			);
			if (fandom.modifiedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async setSubCount(req, res) {
		try {
			const fandom = await fandomSchema.updateOne(
				{name: req.params.name},
				{subcount: req.body.subcount}
			);
			if (fandom.modifiedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deleteFandom(req, res) {
		try {
			const fandom = await fandomSchema.deleteOne({name: req.params.name});
			if (fandom.deletedCount === 0) {
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			} else {
				res.status(200).send(fandom);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}

	async deleteAll(req, res) {
		try {
			await fandomSchema.deleteMany({});
			res.status(200).send('deleted');
		} catch (err) {
			res.status(400).send(err.message);
		}
	}
}

export default new FandomDBDriver();
