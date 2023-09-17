import { Request, Response } from 'express';

export const getHtml = async (req: Request, res: Response) => {
  fetch('http://project-to-test:8080/')
    .then((resp) => resp.text()).then((body) => res.status(200).send(body));
};
