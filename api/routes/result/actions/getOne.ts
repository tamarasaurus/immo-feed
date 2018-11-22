import db from "../../../db";
import { QueryResult } from "pg";
import { Response, Request } from "express";

export default function(request: Request, response: Response, next: any) {
  const id = request.params.id

  db.query("SELECT * FROM results WHERE id = $1", [ id ])
    .then((result: QueryResult) => {
      response.send(result.rows);
    })
    .catch((error: Error) => {
      return next(error);
    });
}
