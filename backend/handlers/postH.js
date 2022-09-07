import express from 'express';
import PostDBDriver from './../db/postDbDriver';

const router = express.Router();

router.get('/', function(req, res) { PostDBDriver.getAllPosts(req, res) });
router.get('/allposts/:fandom', function(req, res) { PostDBDriver.getAssociatedPosts(req,res) });
router.get('/:id', function(req, res) { PostDBDriver.getPost(req, res) });

router.post('/add', function(req, res) { PostDBDriver.addPost(req, res) });
router.post('/setNumVotes/:id', function(req, res) { PostDBDriver.setNumVotes(req, res) });
router.post('/addComment/:id', function(req, res) { PostDBDriver.addComment(req, res) });
router.post('/update/:id', function(req, res) {PostDBDriver.updatePost(req, res) });
router.post('/setUserImage/:id', function(req, res) { PostDBDriver.setUserImage(req, res) });

router.delete('/delete/:id', function(req, res) { PostDBDriver.deletePost(req, res) });
router.delete('/deleteAll', function(req, res) { PostDBDriver.deleteAll(req, res) });

export default router;
