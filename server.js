import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { init } from './backend/routes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create link to Angular build directory
app.use(express.static(path.join(__dirname, "/dist/fanlinc/")));

app.use('/', express.Router());

init(app);

// non-root requests being redirected
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, "/dist/fanlinc/", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Express server running on port", port);
});
