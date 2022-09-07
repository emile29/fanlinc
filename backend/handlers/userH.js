import express from 'express';
import UserDBDriver from './../db/userDbDriver';

const router = express.Router();

router.get('/', function(req, res) { UserDBDriver.getAllUsers(req, res) });
router.get('/:username', function(req, res) { UserDBDriver.getUserByUsername(req, res) });
router.get('/:username/:password', function(req, res) { UserDBDriver.getUser(req, res) });

router.post('/add', function(req, res) { UserDBDriver.addUser(req, res) });
router.post('/update/:username', function(req, res) { UserDBDriver.updateUser(req, res) });
router.post('/addfriend/:username', function(req, res) { UserDBDriver.addFriend(req, res) });
router.post('/addPending/:username', function(req, res) { UserDBDriver.addPending(req, res) });
router.post('/removePending/:username', function(req, res) { UserDBDriver.removePending(req, res) });
router.post('/unfriend/:username', function(req, res) { UserDBDriver.removeFriend(req, res) });
router.post('/subscribe/:username', function(req, res) { UserDBDriver.subscribe(req, res) });
router.post('/unsubscribe/:username', function(req, res) { UserDBDriver.unsubscribe(req, res) });

router.delete('/delete/:username', function(req, res) { UserDBDriver.deleteUser(req, res) });
router.delete('/deleteAll', function(req, res) { UserDBDriver.deleteAll(req, res) });

export default router;
