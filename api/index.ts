import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import createResult from './routes/result'

const app = express();

app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/results', cors(), createResult);

app.listen(process.env.PORT || 8000);
