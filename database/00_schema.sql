CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/**************************************
************** ACCOUNT ****************
**************************************/
DROP TYPE IF EXISTS role;
CREATE TYPE role AS ENUM ('CTO', 'Tech-Lead', 'User');

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email varchar NOT NULL,
    password varchar(100) NOT NULL,
    role role NOT NULL
);

/**************************************
************ TECHNOLOGY ***************
**************************************/
DROP TABLE IF EXISTS technology CASCADE;

DROP TYPE IF EXISTS ring;
CREATE TYPE ring AS ENUM ('Assess', 'Trial', 'Adopt', 'Hold');

DROP TYPE IF EXISTS category;
CREATE TYPE category AS ENUM ('Techniques', 'Platforms', 'Tools', 'Languages');


CREATE TABLE technology (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name varchar UNIQUE NOT NULL,
    category category NOT NULL,
    ring ring NULL,
    ring_reason varchar NULL,
    description varchar NOT NULL,
    created_by uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published boolean DEFAULT false NOT NULL,
    published_at TIMESTAMP NULL,
    changed_by uuid NULL,
    changed_at TIMESTAMP NULL,
    CONSTRAINT fk_created_by
      FOREIGN KEY(created_by)
        REFERENCES account(id),
    CONSTRAINT fk_changed_by
      FOREIGN KEY(changed_by)
        REFERENCES account(id)
);

/**************************************
************ RING HISTORY *************
**************************************/

DROP TABLE IF EXISTS ring_history;
CREATE TABLE ring_history (
    technology_id uuid NOT NULL,
    ring ring NOT NULL,
    ring_reason varchar NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by uuid,
    CONSTRAINT fk_changed_by
      FOREIGN KEY(changed_by)
        REFERENCES account(id)
);

-- index history.technology_id to make search faster
CREATE INDEX ring_history_technology_id_index
ON ring_history (technology_id);
