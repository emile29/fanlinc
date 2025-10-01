import { connection } from './db/db';
import userHandler from './handlers/userH';
import postHandler from './handlers/postH';
import fandomHandler from './handlers/fandomH';

export function init(server) {
	connection();

	server.use('*', function(req, res, next) {
		console.log(req.method + ' ' + req.originalUrl);
		return next();
	});

	server.use('/api/users', userHandler);
	server.use('/api/fandoms', fandomHandler);
	server.use('/api/posts', postHandler);
}
