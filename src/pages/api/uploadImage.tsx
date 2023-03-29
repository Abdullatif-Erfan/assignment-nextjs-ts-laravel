import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
/**
 * Next.js doenst support media files by default,
 * it has its own body parser
 * disable the default body parser at first
 * to parse the incoming data, we use formidable library
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

// const readFile = (req: NextApiRequest, saveLocally: boolean)
// :Promise<{fields:formidable.Fields; files: formidable.Files}> => {
const readFile = (req: NextApiRequest, saveLocally?: boolean) => {
  const options: formidable.Options = {};
  if (saveLocally) {
    /**  process.cwd() => get current directory address */
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      //   newFileName = Date.now().toString() + "_" + path.originalFilename;
      return path.originalFilename;
    };
  }

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    // check image path
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    // if doesn't exist create
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);
  res.json({ done: true });
};

export default handler;
