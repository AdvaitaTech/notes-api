# Notes API

Notes Api is an api that can be used to power your daily note taking activities and save them safely on the cloud

### Setup

Notes Api is build with Node(20.5), Express (4.18.2), Redis (6.0.8) and PostgreSQL (12.17). In order to run this, you must first install the database dependencies for your operating system. Then the steps to run the app are as follows-

1. Clone the repository
2. Run yarn
3. Run `yarn run db:setup`. NOTE: If you are not logged in as a user that can create a PostgreSQL database (your `createdb` command fails), I would first login as such a user (some users set this up as a `postgres` user) and then run the command, and provide this information in the `.env.development` file
4. Create the `.env.development` file and add it to the root of this app. This is what this file should look like -

```
PORT=3000
DBNAME=notes_dev
DBUSER=<your_user>
DBPASSWORD=<your_pass>
DBHOST=127.0.0.1
DBPORT=5432
SECRET=development
REDISURL=redis://127.0.0.1:6379/10
```

5. Run `yarn start` to start the web server on your local machine
6. This api is now ready to create and store your daily notes!

### Testing

The steps for running the tests are similar to the ones mentioned in Setup. However, you must run `yarn run test:setup`, create a `.env.test` file, and run the `yarn test` command instead.

## The API

Writing out some of the APIs that have been created in this application. NOTE: There is a Rate Limit of 15 requests per minute, but you can disable that in the `src/rate-limiter/limiter.ts` file by returning true in the `isRequestAllowed` method.

### Auth APIs

#### Create User

```
curl --location --request POST 'localhost:3000/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Test",
    "email": "test1@example.com",
    "password": "testing",
    "confirm": "testing"
}'
```

#### Login User

```
curl --location --request POST 'localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test1@example.com",
    "password": "testing"
}'
```

### Note APIs

#### Create Note

```
curl --location --request POST 'localhost:3000/notes/' \
--header 'Authorization: Bearer <LOGIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "My first note",
    "body": "Daily affirmations: I am worthy",
    "tags": ["note"]
}'
```

#### Get Note

```
curl --location --request GET 'localhost:3000/notes/1' \
--header 'Authorization: Bearer <LOGIN_TOKEN>' \
--header 'Content-Type: application/json' \
```

#### List Notes

```
curl --location --request GET 'localhost:3000/notes' \
--header 'Authorization: Bearer <LOGIN_TOKEN>'
```

#### Update Note

```
curl --location --request PUT 'localhost:3000/notes/1' \
--header 'Authorization: Bearer <LOGIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "My first updated note"
}'
```

#### Search Notes

```
curl --location --request GET 'localhost:3000/notes/search?query=first' \
--header 'Authorization: Bearer <LOGIN_TOKEN>'
```

#### Delete Note

```
curl --location --request DELETE 'localhost:3000/notes/1' \
--header 'Authorization: Bearer <LOGIN_TOKEN>'
```

### Queries

Please reach out to `vikramthyagarajan92@gmail.com` in case of any queries
