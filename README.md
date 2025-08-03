## Getting started

> **Important!** Ts.ED requires Node >= 14, Express >= 4 and TypeScript >= 4.

```batch
# install dependencies
$ npm install

# serve
$ npm run start

# build for production
$ npm run build
$ npm run start:prod
```

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```

### Troubleshooting Docker Issues

#### MySQL Client Package

The Dockerfile uses `default-mysql-client` package instead of `mysql-client` because:

- In newer Debian-based images (including the node:20 image), the `mysql-client` package is no longer available
- The `default-mysql-client` metapackage provides the MySQL client tools needed by the startup script
- This ensures compatibility with the latest Debian repositories

If you encounter this error:
```
E: Package 'mysql-client' has no installation candidate
```

The solution is to use `default-mysql-client` instead in the Dockerfile.

## Prisma migrations

1. This creates models for ORM:
```shell
prisma generate
```

2. This creates migration files but not applies to DB:
```shell
prisma migrate dev --create-only
```

3. Edit generated files. Delete these lines:
```sql
DROP INDEX `idx_location` ON `geo_locations`;
```
```sql
CREATE INDEX `idx_location` ON `geo_locations`(`location`);
```

4. Run this command to deploy the migrations to the DB:
```shell
prisma migrate deploy
```
DON'T CHANGE MIGRATIONS AFTER IT APPLIED

R

The mysql container in your docker-compose.yml is independent of your app code. When you rebuild or restart only the app service (for example, after changing your application code), the mysql container will not be redeployed or restarted unless you explicitly do so.


If you run docker-compose up --build app, only the app container is rebuilt and restarted.
The mysql container will keep running with its data persisted in the mysql_data volume.
The depends_on directive ensures mysql starts before app, but does not restart mysql when you rebuild app.