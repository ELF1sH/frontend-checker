import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import extract from 'extract-zip';
import * as fs from 'fs';
import path from 'path';

/*
A METHOD OF UPLOADING A SOURCE CODE OF THE REFERENCE SOLUTION

this method proves that we can easily substitute code of reference solutions programmatically
*/

export const uploadSrc = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // IT MEANS THAT THE NAME OF THE FIELD IN THE FORM DATA SHOULD BE SRC
  let { src } = req.files;
  src = src as fileUpload.UploadedFile;

  const volumeDir = '/reference-solution/src/';
  // const volumeDir = '/Users/RayanS/Documents/unzip';

  const zipFilePath = `${volumeDir}${src.name}`;
  // const targetPath = `/Users/RayanS/Documents/${src.name}`;

  fs.readdirSync(volumeDir).forEach((item) => {
    const itemPath = path.join(volumeDir, item);

    fs.stat(itemPath, (err, stats) => {
      if (stats.isFile()) {
        fs.rmSync(itemPath);
      } else if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      }
    });
  });

  await src.mv(zipFilePath);

  await extract(zipFilePath, {
    dir: volumeDir,
  });

  fs.unlinkSync(zipFilePath);

  return res.sendStatus(200);
};
