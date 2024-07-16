import { Request } from "express";

const parseJsonArrays = (req: Request, fields) => {
  const parsedArrays = {};

  fields.forEach((field) => {
    if (req.body[field]) {
      try {
        parsedArrays[field] = JSON.parse(req.body[field]);
      } catch (err) {
        parsedArrays[field] = [];
      }
    }
  });

  return parsedArrays;
};

export default parseJsonArrays;
