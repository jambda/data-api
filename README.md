# @Jambda Data Api
#### A database driven rest api generator for [Jambda](https://www.npmjs.com/package/jambda)
If you have never heard of Jambda, check it out, is still under heavy development and far from being ready to production.

## How it works
The Data Api module plugins in the Jambda framework to allow for easy development & deployment of data driven REST micro-services by defining models . 
To use this module you first must have Jambda installed. Than it is just as simple as adding the proper configuration block to your Jambda application.

```
npm i jambda --save && npm i @jambda/data-api --save
```
Once installed, head to your configuration file ```config.yml``` and add the following block:
```yml
...
database:
  modelsPath: 'src/__mocks__/yml'
  production:
    driver: memory
  development:
    driver: memory
  test:
    driver: memory
```
In this example we are using the memory adaptor, which is great for development and testing purposes, but make sure to set the production block to a real database. 

## Connectors
Currently we provide ORM implementations for the following database systems.

* [Redis](https://redis.io/)
* [Rethink Db](https://www.rethinkdb.com/)
* [MySql Db](https://www.mysql.com/)
* [Maria Db](https://mariadb.org/)
* [Mongo Db](https://www.mongodb.com/)
* [Arango Db](https://www.arangodb.com/)
* [Firebase](https://firebase.google.com/)

## Models
Models are configure using yaml files, where you define properties, validations and relationships.
```ymal
name: user
interfaces: [get, post, put, patch, delete]
properties:
  id:
    type: Number
    primary: true
  active:
    type: Boolean
    default: false
  validated:
    type: Boolean
    default: false
  name:
    type: String
    index: true
  username:
    type: String
    unique:
      value: true
      message: 'Username already exists'
  email:
    type: String
    unique: true
  password:
    type: String
    required: true
    length:
      min:
        value: 5
        message: 'Password is too short'
  posts:
    type: hasMany
    target: post
  created:
    type: Date
    default: now
indexes:
  indexOne:
    columns: [name]
  indexTwo:
    columns: [username, email]
```

## REST api
Each model will be added to your database if it does not already exist, and will have it's own rest api, that include the following endpoints:

##### NEW a Record
> GET /[:tablename]
##### LIST Records
> GET /[tablename] 
##### GET a Record
> GET /[:tablename]/[:id]
##### COUNT Records
> GET /[tablename]/count
##### POST a Record
> POST /[:tablename]
##### PATCH a Record
> PATCH /[:tablename]/[:id]
##### PUT a Record
> PUT /[:tablename]
##### DELETE a Record
> DELETE /[:tablename]/[:id]