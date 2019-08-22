import express from 'express';
import * as bodyParser from 'body-parser';

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./build/'));

app.listen(4000, () => console.log(`Started app on 4000`));
