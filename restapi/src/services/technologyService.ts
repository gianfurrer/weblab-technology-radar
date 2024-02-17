import * as db from "@src/database/database";
import { PublishDetails, Technology } from "@src/types/technology.types";

const FIXME_USER = "20fe3303-f280-4bf4-8575-8561d0ad5601";

export async function addTechnology(technology: Technology) {
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
    FIXME_USER
  )[0];
}

export async function updateTechnology(technology: Technology) {
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

  return await db.executeSQL(
    `UPDATE technology SET name = $1, category = $2, description = $3, changed_by = $4, changed_at = $5 WHERE id = $6 RETURNING *`,
    name,
    category,
    description,
    FIXME_USER,
    new Date(),
    id
  )[0];
}

export async function getTechnologies(): Promise<Technology[]> {
  return await db.executeSQL("SELECT * FROM technology");
}

async function getTechnologyById(id: string): Promise<Technology | null> {
  const rows = await db.executeSQL("SELECT * FROM technology WHERE id = $1", id);
  return rows[0] || null;
}

async function getTechnologyByName(name: string): Promise<Technology | null> {
  const rows = await db.executeSQL("SELECT * FROM technology WHERE name = $1", name);
  return rows[0] || null;
}

export async function publishTechnology(publishDetails: PublishDetails) {
  const technology = await getTechnologyById(publishDetails.technology_id);
  if (technology === null) {
    throw Error(`Technology with id '${publishDetails.technology_id}' not found`);
  } else if (technology.published) {
    throw Error(`Technology with id '${publishDetails.technology_id}' ('${technology.name}') is already published`);
  }
  publishDetails.ring ??= technology.ring;
  publishDetails.ring_reason ??= technology.ring_reason;

  if (!publishDetails.ring) {
    throw Error(`Unable to publish technology ${technology.name}: no ring defined`);
  } else if (!publishDetails.ring_reason) {
    throw Error(`Unable to publish technology ${technology.name}: no ring reason defined`);
  }

  return await db.executeSQL(
    `UPDATE technology SET published = true,
                           published_at = $1,
                           ring = $2,
                           ring_reason = $3
                       WHERE id = $4
     RETURNING *`,
    new Date(),
    publishDetails.ring,
    publishDetails.ring_reason,
    publishDetails.technology_id
  )[0];
}
