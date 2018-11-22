import db from "../../../db";
import { QueryResult } from "pg";
import { Response, Request } from "express";

export default function(req: Request, res: Response, next: any) {
  res.json({})
  // INSERT INTO customers (name, email)
  // VALUES
  //  (
  //  '1',
  //  '2'
  //  )
  // ON CONFLICT (name)
  // DO
  //  UPDATE
  //    SET email = EXCLUDED.email || ';' || customers.email;
  // Update the index after insertion for full text search
}
