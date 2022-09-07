import express from 'express';
import FandomDBDriver from './../db/fandomDbDriver';

const router = express.Router();

router.get('/', function(req, res) { FandomDBDriver.getAllFandoms(req,res) });
router.get('/:name', function(req, res) { FandomDBDriver.getFandom(req, res) });

router.post('/add', function(req, res) { FandomDBDriver.addFandom(req,res) });
router.post('/update/:name', function(req, res) { FandomDBDriver.updateFandom(req, res) });
router.post('/setPosts/:name', function(req, res) { FandomDBDriver.setPosts(req, res) });
router.post('/setMods/:name', function(req, res) { FandomDBDriver.setMods(req, res) });
router.post('/setEvents/:name', function(req, res) { FandomDBDriver.setEvents(req, res) });
router.post('/setSubCount/:name', function(req, res) { FandomDBDriver.setSubCount(req, res) });

router.delete('/delete/:name', function(req, res) { FandomDBDriver.deleteFandom(req, res) });
router.delete('/deleteAll', function(req, res) { FandomDBDriver.deleteAll(req, res) });

export default router;
