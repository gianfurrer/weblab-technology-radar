import { Request, Response } from 'express';
import * as service from '@src/services/technologyService';
import { PublishDetails as PublishTechnology, Technology } from '@src/types/technology.types';
import { Role } from '@src/types/authentication.types';

function hasAccessToUnpublishedTechnologies(role: Role): boolean {
  return [Role.CTO, Role.TechLead].includes(role);
}

export const getTechnologies = async (req: Request, res: Response) => {
  let onlyPublished = String(req.query['onlyPublished'] ?? 'true').toLowerCase() === 'true';
  if (onlyPublished === false && !hasAccessToUnpublishedTechnologies(req.session.user.role)) {
    onlyPublished = true;
  }

  const technologies = await service.getTechnologies(onlyPublished);
  res.send(technologies);
};

export const getTechnology = async (req: Request, res: Response) => {
  const technology_id = req.params['id'];
  if (!technology_id) {
    return res.status(400).send({ errors: ['Missing technology id.'] });
  }
  try {
    const technology = await service.getTechnologyById(technology_id);

    if (!technology.published && !hasAccessToUnpublishedTechnologies(req.session.user.role)) {
      return res.status(400).send({ errors: ['Provided technology id does not exist or is not published.'] });
    }

    technology.ring_history = await service.getRingHistory(technology_id);
    res.send(technology);
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
    return;
  }
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
    const technology = await service.publishTechnology(publishDetails, req.session.user);
    res.send(technology);
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
    return;
  }

  res.end();
};
