import db from "../../../db";
import { Response, Request } from "express";

export default function(request: Request, response: Response, next: any) {
  const { name, price, size, description, link, photo } = request.body;

  // @TODO - Make request data into a validated object
  // @TODO - Implement upsert (so accept all post data)
  //{
  //     "name": "Appartement",
  //     "price": 55000,
  //     "size": 1,
  //     "description": "Griasdfdsdgny",
  //     "link": "https://gasdfasdsdfsdlesd.c3om",
  //     "created": null,
  //     "updated": null,
  //     "photo": "https://v.seloger.com/s/crop/310x225/visuels/0/b/t/k/google.com"
  // }

  db.query(`
    INSERT INTO results( name, price, size, description, link, photo )
    VALUES ($1, $2, $3, $4, $5, $6 )
  `,
    [ name, price, size, description, link, photo ])
  .then(() => {
    response.status(200).send('OK')
  })
  .catch((error: Error) => {
    return next(error);
  });
}
