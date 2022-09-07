import fandomSchema from './../models/fandom';

class FandomDBDriver {
	getAllFandoms(req, res) {
		fandomSchema.find(function(err, fandoms) {
			if (err)
				res.status(400).send(err.message);
			else
				res.status(200).json(fandoms);
		})
	}

	getFandom(req, res) {
		fandomSchema.find({name: req.params.name}, function(err, fandom) {
			if (err)
				res.status(400).send(err.message);
			else if (fandom == '')
				res.status(404).send("Fandom '" + req.params.username + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	addFandom(fandom, res) {
		var newFandom = new fandomSchema(fandom.body)
		newFandom.save(function(err, user) {
			if (err)
				res.status(400).send(err.message);
			else
				res.status(200).send(user);
		});
	}

	updateFandom(req, res) { //for all other fields that's not array
		fandomSchema.updateOne({
			name : req.params.name
		}, req.body, function(err, fandom) {
			if (err)
				res.status(404).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom)
		})
	}

	setPosts(req, res) {
		fandomSchema.updateOne({name : req.params.name}, {$push: {"posts": req.body.newPost}},
			function(err, fandom) {
			if (err)
				res.status(400).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	setMods(req, res) {
		fandomSchema.updateOne({name : req.params.name}, {$push: {"mods": req.body.newMod}},
			function(err, fandom) {
			if (err)
				res.status(400).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	setEvents(req, res) {
		fandomSchema.updateOne({name : req.params.name}, {$push: {"events": req.body.newEvent}},
			function(err, fandom) {
			if (err)
				res.status(400).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	setSubCount(req, res) {
		fandomSchema.updateOne({name : req.params.name}, {subcount: req.body.subcount},
			function(err, fandom) {
			if (err)
				res.status(400).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("Fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	deleteFandom(req, res) {
		fandomSchema.deleteOne({name : req.params.name}, function(err, fandom) {
			if (err)
				res.status(400).send(err.errmsg);
			else if (fandom.n == 0)
				res.status(404).send("fandom '" + req.params.name + "' not found");
			else
				res.status(200).send(fandom);
		});
	}

	deleteAll(req, res) {
		fandomSchema.deleteMany({}, function(err) {
			if (err)
				res.status(400).send(err);
			else
				res.status(200).send('deleted');
		});
	}
}

export default new FandomDBDriver();
