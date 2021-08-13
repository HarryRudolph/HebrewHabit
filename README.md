# Hebrew Habit

[Hebrew Habit](https://hebrewhabit.com) is a tool to support independent/self-directed learning of reading Modern Hebrew.

## Using the App

The application is available live at https://hebrewhabit.com.

Alternatively you can download the source from (GitHub), and build yourself.

First build the React app

```
$ cd client && npm run build
```

Then run the express server. This must be in the root of the application.

```
$ npm i
$ npm run start
```

The console will log which port the express server is running on.

The application will be able to be accessed at localhost:PORT. (You can set a custom port using an environment variable.)

Node.js will use package.json to automatically install all required dependencies.

## Database

For the application to work correctly you will need to set up a local PostgreSQL database.
You will need to be running a PostgreSQL database, please adjust environment variables in the example .env file. There is an example .env in the repository.

Run dbsettingup.sql to create the correct tables and fill them appropriately.

## JSDoc

You can generate the JSDocs for this project by running:

```
$ npm run docs
```

They are outputted to the 'out' folder.
