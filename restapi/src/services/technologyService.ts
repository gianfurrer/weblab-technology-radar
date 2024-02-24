import * as db from "@src/database/database";
import { Account } from "@src/types/authentication.types";
import { PublishDetails, Technology } from "@src/types/technology.types";


export async function addTechnology(technology: Technology, created_by: Account) {
  let { name, category, ring, description, ring_reason } = technology;

  const existing_technology = await getTechnologyByName(name);
  console.log("existing_technology", existing_technology);
  if (existing_technology !== null) {
    throw Error(`Failed to add technology: Technology with name ${name} already exists`);
  }

  return await db.executeSQL(
    `INSERT INTO technology (name, category, ring, description, ring_reason, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    name,
    category,
    ring,
    description,
    ring_reason,
    created_by.id
  )[0];
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

export async function getTechnologies(where: string = "", ...args): Promise<Technology[]> {
  return await db.executeSQL(`SELECT t.id, t.name, t.category, t.ring, t.description, t.ring_reason,
                                     created.email as created_by, t.created_at, t.published, t.published_at,
                                     changed.email as changed_by, t.changed_at
                              FROM technology as t
                              INNER JOIN account as created ON created.id = t.created_by
                              LEFT JOIN account as changed ON changed.id = t.changed_by
                              ${where};`, ...args);
}

async function getTechnologyById(id: string): Promise<Technology | null> {
  const rows = await getTechnologies("WHERE t.id = $1", id);
  return rows[0] || null;
}

async function getTechnologyByName(name: string): Promise<Technology | null> {
  const rows = await getTechnologies("WHERE t.name = $1", name);
  return rows[0] || null;
}

export async function publishTechnology(publishDetails: PublishDetails) {
  const technology = await getTechnologyById(publishDetails.id);
  if (technology === null) {
    throw Error(`Technology with id '${publishDetails.id}' not found`);
  } else if (technology.published) {
    throw Error(`Technology with id '${publishDetails.id}' ('${technology.name}') is already published`);
  }
  publishDetails.ring ??= technology.ring;
  publishDetails.ring_reason ??= technology.ring_reason;

  if (!publishDetails.ring) {
    throw Error(`Unable to publish technology ${technology.name}: no ring defined`);
  } else if (!publishDetails.ring_reason) {
    throw Error(`Unable to publish technology ${technology.name}: no ring reason defined`);
  }

  await db.executeSQL(
    `UPDATE technology SET published = true,
                           published_at = $1,
                           ring = $2,
                           ring_reason = $3
                       WHERE id = $4`,
    new Date(),
    publishDetails.ring,
    publishDetails.ring_reason,
    publishDetails.id
  );
  return await getTechnologyById(publishDetails.id);
}
