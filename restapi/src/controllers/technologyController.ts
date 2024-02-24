import { Request, Response } from "express";
import * as service from "@src/services/technologyService";
import { PublishDetails as PublishTechnology, Technology } from "@src/types/technology.types";

export const getTechnologies = async (req: Request, res: Response) => {
  const technologies = await service.getTechnologies();
  res.send(technologies);
};

export const createTechnology = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const technology = await service.addTechnology(body, req.session.user);
    res.send(technology);
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
    return;
  }
};

export const updateTechnology = async (req: Request, res: Response) => {
  const updatedTechnology: Technology = req.body;

  try {
    const technology = await service.updateTechnology(updatedTechnology, req.session.user);
    res.send(technology);
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
    return;
  }

  res.end();
};

export const publishTechnology = async (req: Request, res: Response) => {
  const publishDetails: PublishTechnology = req.body;

  try {
    const technology = await service.publishTechnology(publishDetails);
    res.send(technology);
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
    return;
  }

  res.end();
};
