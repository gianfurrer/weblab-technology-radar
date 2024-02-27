# WebLab - Technology Radar

This project stems from the HSLU _Web Programming Lab_ Module.

The purpose of it is to showcase the usage of JavaScript/TypeScript, both on the server and web-application side.

## Users

Since the Application does not have a User Management, there are three predefined Users in the [Database Seed](./database/01_seed.sql) which can be used to Login:

| EMail                         	| Password           	| Role      	|
|-------------------------------	|--------------------	|-----------	|
| cto@technology-radar.ch       	| cto-password       	| CTO       	|
| tech-lead@technology-radar.ch 	| tech-lead-password 	| Tech-Lead 	|
| user@technology-radar.ch      	| user-password      	| User      	|


## Setup

First of all, make sure to have [Docker](https://docs.docker.com/engine/install/) installed.

### Docker Compose

The repository contains two docker-compose files: one for development and one for "production".

Both of them define the same three services:
- frontend
- rest-api
- database

#### Production Environment

The production [docker-compose.yml](./docker-compose.yml) file uses the following Dockerfiles:
- frontend: [Dockerfile](./frontend/Dockerfile)
- rest-api: [Dockerfile](./restapi/Dockerfile)

For the database, a standard postgres docker image is used.

Both Dockerfiles **copy** the source directory into the container and statically build the applications.

To run the built frontend, a nginx server also had to be setup with a [custom nginx config](./frontend/nginx.conf).

If you want start the production containers, run:

```bash
docker-compose up
```

Open the Website: http://localhost:3001

#### Development Environment

The development [docker-compose.dev.yml](./docker-compose.dev.yml) file uses the following Dockerfiles:
- frontend: [Dockerfile.dev](./frontend/Dockerfile.dev)
- rest-api: [Dockerfile.dev](./restapi/Dockerfile.dev)

For the database, a standard postgres docker image is used.

Both Dockerfiles **mount** the respective source directory into the container,
which allows for live reloading of the applications.

If you want to start the development containers, run:

```bash
docker-compose -f docker-compose.dev.yml up
``` 

Open the Website: http://localhost:3001

##### Cleaning Up Docker

To clean up the created docker containers, use:

```bash
docker-compose down --rmi local
```

To remove the database data, run this when no containers are running:

```bash
docker volume rm weblab-technology-radar_pgdata
```


#### Alternative to Docker

To setup the application without using docker, a few more steps are required:

##### Database

1. Install [PostgreSQL](https://www.postgresql.org/download/) (Version 16) 
1. Create a new Database called `technology-radar`
1. Change the values inside the [.env.postgres](./.env.postgres) so that the RestAPI can connect to the databse.
1. Run all the SQL Scripts inside the [database](./database/) folder to setup the database schmea and seed data.

##### RestAPI

1. Install [Node](https://nodejs.org/en/download/current) >= 20
1. Install the dependencies and build/start the application:

```
cd restapi
npm install

# Either
npm run build
npm run start

# Or
npm run dev
```


##### Frontend

1. Change the [proxy.conf.json](./frontend/src/proxy.conf.json) to
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

2. Install the npm dependencies and start the application:
```
cd frontend
npm install
npm run start
```

3. Open the Website: http://localhost:4200
