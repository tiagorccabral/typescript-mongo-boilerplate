# Node.JS - Typescript - Express - MongoDB - Starter Project

## About

A complete Node.JS starter project to bootstrap any projects that you may want to create with the stack Typescript + Express + MongoDB serving as an API.

## How to install

1 - Git clone this repo

```bash
git clone https://github.com/tiagorccabral/typescript-mongo-boilerplate.git
```

## Starting the server (With Docker)

1 - Copy the contents of ***env-example*** file into a folder called ***env***.

Make sure you have ***MONGO_INITDB_ROOT_USERNAME*** and ***MONGO_INITDB_ROOT_PASSWORD*** vars on mongo.env ***uncommented***. 

(you can change the other env variables inside these files as needed).

2 - Give the init script permissions to run locally
```bash
chmod +x init.sh
```

3 - Then create the containers with docker-compose
```bash
docker-compose up
```

## Starting the server (With Yarn)

1 - Copy the contents of ***env-example*** file into a folder called ***env***.
(use the following script)
```bash
yarn setup
```

***OBS1:*** This command will copy the contents of ***env-example*** file into a new folder ***env*** (change here the variables inside these files as needed).

***OBS2:*** Make sure you have ***MONGO_INITDB_ROOT_USERNAME*** and ***MONGO_INITDB_ROOT_PASSWORD*** vars on mongo.env ***commented***.

2 - To get the project running, first install the dependencies
```bash
yarn install
```

3 - Then start the development server
```bash
yarn dev
```

## Running tests

1 - To run the tests, use the following command
```bash
yarn test
```
