import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import extract from 'extract-zip';
import * as fs from 'fs';
import path from 'path';

export const uploadSrc = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let { src } = req.files;
  src = src as fileUpload.UploadedFile;

  const volumeDir = '/project-to-test/src/';
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
    onEntry: (entry) => {
      console.log(entry);
    },
  });

  fs.unlinkSync(zipFilePath);

  return res.sendStatus(200);
};
