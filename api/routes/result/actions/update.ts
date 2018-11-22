import db from "../../../db";
import { QueryResult } from "pg";
import { Response, Request } from "express";

export default function(request: Request, response: Response, next: any) {
    response.json({})
//   db.query("SELECT * FROM results", [])
//     .then((result: QueryResult) => {
//       res.send(result.rows);
//     })
//     .catch((error: Error) => {
//       return next(error);
//     });
}
