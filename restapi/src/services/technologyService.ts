import * as db from '@src/database/database';
import { Account } from '@src/types/authentication.types';
import { PublishDetails, Ring, RingHistroy, Technology } from '@src/types/technology.types';

export async function addTechnology(technology: Technology, created_by: Account) {
  let { name, category, ring, description, ring_reason } = technology;

  const existing_technology = await getTechnologyByName(name);
  if (existing_technology !== null) {
    throw Error(`Failed to add technology: Technology with name ${name} already exists`);
  }

  technology = await db.executeSQL(
    `INSERT INTO technology (name, category, ring, description, ring_reason, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    name,
    category,
    ring,
    description,
    ring_reason,
    created_by.id
  )[0];

  if (technology.ring) {
    await updateRingHistroy(technology.id, ring, ring_reason ?? '', created_by);
  }

  return technology;
}

export async function updateTechnology(technology: Technology, changed_by: Account) {
  const { name, category, description, id } = technology;
  const existingTechnology = await getTechnologyById(id);
  if (existingTechnology === null) {
    throw Error(`Failed to update technology: Technology with name ${id} doesn't exist`);
  }
  const conflictingTechnology = await getTechnologyByName(name);
  if (conflictingTechnology !== null && conflictingTechnology.id !== existingTechnology.id) {
    throw Error(
      `Failed to update technology: Technology with name '${name}' already exists (with id '${conflictingTechnology.id}`
    );
  }

  await db.executeSQL(
    `UPDATE technology
     SET name = $1,
         category = $2,
         description = $3,
         changed_by = $4,
         changed_at = $5
     WHERE id = $6`,
    name,
    category,
    description,
    changed_by.id,
    new Date(),
    id
  );
  return await getTechnologyById(id);
}

export async function getTechnologies(where: string = '', ...args): Promise<Technology[]> {
  return await db.executeSQL(
    `SELECT t.id, t.name, t.category, t.ring, t.description, t.ring_reason,
                                     created.email as created_by, t.created_at, t.published, t.published_at,
                                     changed.email as changed_by, t.changed_at
                              FROM technology as t
                              INNER JOIN account as created ON created.id = t.created_by
                              LEFT JOIN account as changed ON changed.id = t.changed_by
                              ${where};`,
    ...args
  );
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  const rows = await getTechnologies('WHERE t.id = $1', id);
  return rows[0] || null;
}

async function getTechnologyByName(name: string): Promise<Technology | null> {
  const rows = await getTechnologies('WHERE t.name = $1', name);
  return rows[0] || null;
}

async function updateRingHistroy(
  technology_id: string,
  ring: Ring,
  ring_reason: string,
  changed_by: Account
): Promise<void> {
  await db.executeSQL(
    `INSERT INTO ring_history (technology_id, ring, ring_reason, changed_by, changed_at)
     VALUES ($1, $2, $3, $4, $5)`,
    technology_id,
    ring,
    ring_reason,
    changed_by.id,
    new Date()
  );
}

export async function getRingHistory(technology_id: string): Promise<RingHistroy[]> {
  return await db.executeSQL(
      `SELECT h.technology_id, h.ring, h.ring_reason, a.email as changed_by, h.changed_at
            FROM ring_history as h
            LEFT JOIN account as a ON a.id = h.changed_by
            WHERE h.technology_id = $1`,
      technology_id
    );
}

export async function publishTechnology(publishDetails: PublishDetails, changed_by: Account): Promise<Technology> {
  const technology = await getTechnologyById(publishDetails.id);
  if (technology === null) {
    throw Error(`Technology with id '${publishDetails.id}' not found`);
  }
  publishDetails.ring ??= technology.ring;
  publishDetails.ring_reason ??= technology.ring_reason;

  if (!publishDetails.ring) {
    throw Error(`Unable to publish technology ${technology.name}: no ring defined`);
  } else if (!publishDetails.ring_reason) {
    throw Error(`Unable to publish technology ${technology.name}: no ring reason defined`);
  }

  await db.executeSQL(
    `UPDATE technology SET published = $1,
                           published_at = $2,
                           ring = $3,
                           ring_reason = $4,
                           changed_by = $5,
                           changed_at = $6
                       WHERE id = $7`,
    publishDetails.publish,
    publishDetails.publish ? new Date() : null,
    publishDetails.ring,
    publishDetails.ring_reason,
    changed_by.id,
    new Date(),
    publishDetails.id
  );

  // Update RingHistroy if Ring or Ring Reason changed
  if (publishDetails.ring !== technology.ring || publishDetails.ring_reason !== technology.ring_reason) {
    await updateRingHistroy(technology.id, publishDetails.ring, publishDetails.ring_reason, changed_by);
  }

  return await getTechnologyById(publishDetails.id);
}
