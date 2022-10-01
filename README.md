# MVP Project

A simple API to manage users & tasks

## With docker

### Running the project

Create a .env file:
```sh
cp .env.example .env
```

Execute the docker container
```sh
docker-compose up -d
```

At this point the application will be running at the `localhost:3333` (may take a moment to start while the app is building and the database is being created, be sure to check the docker logs)

### Seeding the database

Execute the following command to generate test data

```
docker exec app npm run seed
```

### Running tests

```
docker exec app npm run test
```

## Without docker

### Running the project

Create a .env file:
```sh
cp .env.example .env
```

Fill the .env file with the informations to access the POSTGRES database (host, user, password, port).

Install the project dependencies:
```sh
npm install
```

Create the database:
```sh
npm run create-database
```

Run the project:
```sh
npm run serve
```

At this point the application will be running at the `localhost:3333`

### Seeding the database

Execute the following command to generate test data

```
npm run seed
```

### Running tests

```
npm run test
```

## The application

If you use the test data, there are two users available to login on the application.

User 1
```json
{
	"data": {
		"email": "user_1@gmail.com",
		"password": "123456"
	}
}
```

User 2
```json
{
	"data": {
		"email": "user_2@gmail.com",
		"password": "654321"
	}
}
```

## Authentication routes

### Register a user

<b>Method:</b> POST <br/>
<b>Endpoint:</b> /api/auth/register <br/>
<b>Payload:</b>
```json
{
	"data": {
		"email": "test@test.com",
		"name": "test",
		"password": "123456"
	}
}
```

### Login a user

<b>Method:</b> POST <br/>
<b>Endpoint:</b> /api/auth/login <br/>
<b>Payload:</b>
```json
{
	"data": {
		"email": "user_1@gmail.com",
		"password": "123456"
	}
}
```

## Task routes

The tasks routes require authentication. You need to use the `api/auth/login` route, and then use the generated JWT token as a header in the following format `Authorization: Bearer THE_TOKEN_HERE`

### List all tasks for the current user

<b>Method:</b> GET <br/>
<b>Endpoint:</b> /api/tasks

### Show a specific task

<b>Method:</b> GET <br/>
<b>Endpoint:</b> /api/tasks/:id

### Create a task

<b>Method:</b> POST <br/>
<b>Endpoint:</b> /api/tasks <br/>
<b>Payload:</b>
```json
{
	"data": {
		"name": "test",
		"description": "test",
		"status": "todo"
	}
}
```

### Update a task

<b>Method:</b> POST <br/>
<b>Endpoint:</b> /api/tasks/{id} <br/>
<b>Payload:</b>
```json
{
	"data": {
		"name": "test",
		"description": "test",
		"status": "todo"
	}
}
```

### Delete a task

<b>Method:</b> DELETE <br/>
<b>Endpoint:</b> /api/tasks/{id} <br/>


## Dev notes

* I created a basic express/typescript architecture from scratch. I decided to not strict follow DDD to keep things simple, however, I used Entity classes for database and Model classes for application models to create some boundaries between the domain complexity and technical complexity;
* I created tests for the repositories, models and controllers. There are no tests for the services classes because it would be too repetitive with the tests for the controllers. However, on a production app, we should have tests for the service classes as well;
* I created some input validation (eg validating if a user e-mail already exists and if the email is valid) and returned the correct status code;
* Permission issues (eg: a user try to edit a task from another user) are only generating internal server error. That is happening because we don't have specific exception being throw to that case. On a production application we should have a specific exception for that to be able to display a formatted message for the user of the api and also return the correct http status code;
* Everytime the application is restarted the database is being recreated with sequelize sync. In a production application that would not be possible, a migration system should be used.
