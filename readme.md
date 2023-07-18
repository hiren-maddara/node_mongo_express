# NODEjs, MONGOdb, EXPRESS: Server side development

## Structure

1. Introduction: NodeJs, Npm, the Web
2. Node Js behind the scenes
3. Express Js
4. MongoDB + Mongoose
5. Error handling
6. Authentication, authorization & security
7. Data modelling
8. Server side rendering
9. Advacnded features: payments, email, file uplaods
10. Git and deployment

## 1. Introduction to Node Js, NPM, Backend web dev

- NODE js is a js runtime built on google's open source V8 engine. So we can run JS code out of the browser and run it machines.
- Allows us to write server side code using javascript to build fast highly scalable network applications.

- Node js is single threaded, based on event driven, non blocing concurency I/O model
- Usage: API with database behid it, Data streaming(YouTube, netflix), Real time chat app, server side web applications
- Dont Use: Applications with heavy server sde processing. CPU intesive tasks wll requirelangauges like python, C#
- Used by companies like Netflix, Uber, Paypal, Ebay
- We can use Javascript across the entire dev stack. We can writ ethe whole app in one language
- NPM provides a huge library of open-source packages
- It has a very active developer comunity

- After installing node, you can directly work with inthe command line by running `node` command to enter the node REPL(Read Eval Print Loop)

> When in the REPL, you can press tab to see global variables in node,
> Type any object and press tab to see it properties, while in the REPL

1. Node core modules

- Node contains several packages/modules by default that can do various things like promisify, file system access, path, system information
- We can access these modules through the `require()` function

- Reading and writing files

```js
const fs = require("fs");

// blocking/sync method
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn); //=> reads file content

const textOut = `This is what we know about avocado`;
fs.writeFileSync("./txt/output.txt", textOut); //=> write the text to the file
```

- Doing it asynchronously, b'se if the process is long, it will block the other code

```js
// async method
const fs = require("fs");

fsreadFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile("./txt/read-this.txt", "utf-8", (err, data2) => {
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      fs.writeFile(
        `./txt/final.txt`,
        `${data2}\n ${data3}`,
        "utf-8",
        (err) => {}
      );
    });
  });
});

//- This quickly leads to callback hell, so it is better to use promises or async/await
```

2. Creating a simple web server

```js
const fs = require("fs");
const http = require("http"); //- gives us networking functionalty

//SERVER
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end("Hello from server"); //send back response
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
```

3. Basic routing

- This is an importatnt concept, it is also implemeted ina number of ways both on the server and th browser. Many frameworks have in built routing to make it easier but once in a while you need to implement it yourself.
- I have a repo showing implemetation of client side routing, with just vaniall javascript.

```js
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end("Hello from server"); //send back response

  //basic routing
  if (req.url === "/" || req.url === "/overview") {
    res.end("This is overview");
  } else if (req.url === "/product") {
    res.end("This is product");
  } else {
    res.writeHead(404);
    res.end("Page not found");
  }
});
```

4. Simple API

- An API is a program/service that can handle our requests and return data
- This one will send data read from a file to the client when requested.
- The project is `1-node-farm` dorectory, main: `index.js`
- It also generates valid HTML basing polyfilling the templats in `./modules/` with the real data

5. HTML templating

- We write a template text that has constant markup.
- We then edit the parts of the templates by replacing out tags with the real data. We then send the generated HTML markup to the client, which is then rendered.
- E.g

```js
// Template - example

  <figure class="card">
    <div class="card__emoji">{%IMAGE%}{%IMAGE%}</div>
    <div class="card__title-box">
      <h2 class="card__title">{%PRODUCTNAME%}</h2>
    </div>

    <div class="card__details">
      <div class="card__detail-box {%NOT_ORGANIC%}">
          <h6 class="card__detail card__detail--organic">Organic!</h6>
      </div>

      <div class="card__detail-box">
        <h6 class="card__detail">{%QUANTITY%} per 📦</h6>
      </div>

      <div class="card__detail-box">
        <h6 class="card__detail card__detail--price">{%PRICE%}€</h6>
      </div>
    </div>

    <a class="card__link" href="/product?id={%ID%}">
      <span>Detail <i class="emoji-right">👉</i></span>
    </a>
  </figure>


// Parsing function - polyfills the temp with product data
module.exports = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
```

- Templating is easily done by a templating engine like Pug, Mustache, JSX, but this is how the idea is implemented fundamentally

6. Parsing variables from urls: queries, params, ids

- We use the built in module `url`

```js
const url = require('url')
// if req.url = '/product#food?id=9'
url.parse(req.url)

// => returns
{
    hostname: null,
    hash: '#food',
    search: '?id=9',
    query: {id: '9'},
    pathname: 'product',
    path: '/product?id=0',
    href: '/product?id=0'
}
```

7. CReating our own modules

```js
// common js module file(templateParser.js)
module.exports = function (temp, pdt) {
  //functionality
};

// Usage in another file
const replaceTemplate = require("./modules/templateParser");
```

> Important
> There is a section about how the Web works, and how Web development works, if you're interseted.

# Node Js behind the scenes

### Node's architecture

1. V8 Engine: to compile javascript nto machine code

2. Libuv: open source library with async I/O, provides networking, file system access, and the event loop and thread pool. Completely written in C++

3. http-parser, c-ares, openSSL, zlib

- Node js combines these to allow us use javascript to access all these functionalities

### Processes, Threads, and Thread pool

- A node js is an instance of a program in execution on computer
- Node runs in a single thread.
- A thread is a box in the Computer's processor where the program is executed

1. Sequence of execution

   1. Initialise program
   2. Execute top level code
   3. Require modules
   4. Reguster call backs
   5. Start event loop
      - The event loop offloads haevy tasks like DNS lookup, crypto into the thread pool

2. The Event loop

- The heart of the Node js architecture
- The thread pool is in the single thread. I.e NodeJs process > Thread > Event loop
- The thread pool is where code that is not top level is executed. E.g callbacks, etc
- Node js is built around callbacks. And is based on an Event-driven architecture
- Events are emitted, event loops picks them up and calls the callbacks
- Offloads expensive tasks in the thrad pool

> It is your responsibility to avoid blocking the event loop
> What to watch out for better performance

- Don't use sync functions fs, crypto, and zlib modules in callbacks
- Don't perform complex calculations (loops inside loops)
- Be careful with large JSON objects
- Dont use too complex regular expressions

> Point
> Code executed in the event loop is not in a particular. Some types of tasks like timmers are executed first while more expensive task waits.

- I didn't tale much time on this section, but i included the section code files just for reference.

# Express Js: The natours project

- Express is the most used Js frameworks, for implementing node servers
- It is a minimal node.js framework, a higher level of abstraction
- It contains a very robust set of features: complex routing, easier handling of requests and responses, middleware, serverside rendering, etc
- Allows rapid dev't faster
- Makes it easier to organize our application into the MVC architecture

## Setting up and basic routing

```js
const express = require("express");

const app = express();

// respond to get request
app.get("/", (req, res) => {
  res.status(200).send("Hello from server");
});

// start the server
app.listen(3000, "127.0.0.1", () => {
  console.log("server started at http://127.0.0.1:3000");
}); //port, host, callback
```

> There are API testing tools like Postam, Thunderclient, a VS code extension makes it more accessible

## API architecure

API = a piece of software that ca n be used by another peice of sofware, in ordr to allow applications to talk to each other
eg. Web APIs, DOM api, Observer API, NODEs fs or http APIs, OOP objects

#### The REST architcture

1. Seperate API into logical resources

   - Object or representation of somethng which has data associated with it, .g users, tours, reviews

2. Expose structurd resource-based URLs

   - Eg. GET www.tours.com/tours, POST www.tours.com/tours

3. Use http methods(verbs)

   - Use HTTP methods (GET, POST, DELETE, UPDATE)
   - Use `GET /tours` instead of `/getTours` or `DELETE /user/5634` instead of `/delUser/567`

4. Send data as JSON

5. Be stateless

- All state is handled on the client not server. This means that a request shoulc contain all the information about `state` to process a certain request

### Natours

- Create post and get routes

  1. GET request

  2. POST request
     - Data is provided as a JSON object
     - Accessed at req.body

- Fist section is in the folder '4-natours/after-section-06'

1. Responding to url parameters

```js
//url = 127.0.0.1:3000/api/v1/tours/34567333737/1234/1/2
app.get("/api/v1/tours/:id/:code/:x/:y", (req, res) => {
  console.log(req.params);
  res.json({ status: "success" });
});
//=>
req.params = {
  id: "34567333737",
  code: "1234",
  x: "1",
  y: "2",
};

//optional params: postpend a '?'
//127.0.0.1:3000/api/v1/tours/34567333737/1234 - will be acepted
app.get("/api/v1/tours/:id/:code/:x?/:y?", (req, res) => {
  console.log(req.params);
  res.json({ status: "success" });
});

//> don't forget to convert the params to numbrs if they intended to be numbers
```

2. Patch requests - update requests

   - app.patch()

3. Delete request
   - app.delete()

#### A note on status codes

- 100 - 199 : Information responses
- 200 - 299 : Success responses
- 300 - 399 : Redirection messages
- 400 - 499 : Client error responses
- 500 - 599 : Server error responses

- Most common ones

  1. 200 - Ok
  2. 201 - created
  3. 202 - Accepted
  4. 203 - Non-authoritative information
  5. 204 - No content
  6. 400 - Bad requst
  7. 401 - Unauthorised
  8. 402 - Payment required
  9. 403 - Forbidden
  10. 404 - Not found
  11. 405 - Method not allowed
  12. 500 - Internal server error
  13. 501 - Not implemented
  14. 502 - Bad gateway
  15. 503 - Service unavailable

### Refactoring the routes

- Export the route handler functions into their own functions, in another file
- i.e. seperate the handlers from the routes

```js
const getAllTours = function (req, res) {};
const createTour = function (req, res) {};

app.get("/tours", getAllTours);
app.post("/tour", createTour);
//- and so on
```

- Using the `route` function
- Allows us to chain the dfft http methods on the same url, and we pass in the route handlers as callbacks

```js
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("api/v1/tours/:id")
  .get(getTour)
  .patch(upadteTour)
  .deleteTour(deleteTour);
```

### Requet, response cycle

- The essence of express development.
- The cycle starts when a request hits the server, `req` and `res` objects are created, and the data is used to produce a response that is sent to the client
- Inorder to process the data, express uses middleware. These are functions through which the req/res objects pass
- Middleware can be chained, and they all form the middleware stack
- The order in which they are written is ther order of execution.
- Each middleware manipulates the req object and the next one in the stack can use the changes.
- The `next()` function is called in the nonterminal-middleware to call the next middleware

1. Creating our own middleware

- we use the `app.use()` function to add our function to the middle ware stack
- If middleware function without an http method, it applies to all requests, so define global middleware before other middleware.
- Express HTTP methods are also middle ware.

```js
app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});

app.use((rq, rs, n) => {
  rq.requestTime = new Date().toISOString(); //add a time property on the req object
  next();
  //if you dont call the next() fn, the cycle gets stuck here
});
```

2. Using 3rd middleware

- There are middleware that are made as npm pakages. They can be downloaded and l=used in our app
- Eg. `morgan` middleware to log dev data to the console, for each req

3. A btter file structure

   1. /routes

      - tour_routes.js, user_routes.js

   2. /controllers

      - tour_controller.js, user_controller.js

   3. /models

      - tour_model.js : contain that data related scripts

   4. /public

      - /css
      - /img
      - /overview.html, tour.html

   5. /dev_data or /assets
      - /img, /templates

4. Multiple routers and mounting - Rout middleware

- We need to have one file that contain routes for only users, and on for only tours
- So we need to create dfft routers for each purpose

```js
// we have
app.route("/api/tours").get(getT).post(addT);

//we create our router - express.Router()
const tourRouter = express.Router();
tourRouter.route("/").get(getTs).post(addT);
tourRouter.route("/:id").get(getT).patch(updateT);
//- note the '/' is relative to  the one specified in the router
//- This style will allow us seperate the concerns

app.use("/api/v1/tours", tourRouter); //- this router only runs for this url: aka Mounting a router
```

#### Param middle ware

- Middleware that only runs for certain url parameters

```js
//- in the specific router file
//- so for the url in router with this id, this middleware runs.
//- run this param middleware befroe other middleware
router.param("id", (req, res, next, val) => {
  console.log(val);
  next();
});
```

- If we added this param middleware in the `tourRouter`, it wont run for the userRouter
- i.e, it will run for `/api/tours/:id` but not /api/user/:id`. If you want to use it for dfft routers, simply add param middleware for each router

> `app.use(express.json());` This global middleware parses th erequest body into a js object that can be used by other middleware

5. Chaining multiple middleware

- We can run a chain of middleware on a specific route, that runs in the specified order
- Eg. If the `POST /api/tour` request hits the server, we run the `addTour` middleware in the `.post()` method, but wemay need to check if there is an ID, if there's a body

> The Express http methods can take in many callback functions(middleware), that are called in that for each route

- Eg.

```js
router
  .route("/")
  .post(
    tourController.checkID,
    tourController.checkBody,
    tourController.createTour
  );
```

6. Serving static files

- Static files are files that are in our file system that can we cannot access via the browser, and we dont need to define explicit route handlers for them. These include css, image files.
- We need to use built in express middleware

```js
app.use(express.static(`${dirname}/public`)); //pass into express.static the directory you want to statically serve

//-to acess these, we use the url
// 127.0.0.1:3000/css/styles.css: we dont need to type the directory name
```

7. Environment variables

- Nod eprocesses run in an environment that has a number of variables. These can be accessed at `process.env`
- `console.log(process.env)`

- We can create a `config.env` file to store our sensitive data lik database password, api keys, that are only in the application process when it runs.

```env
NODE_ENV=development
PORT=3000
USERNAME=jonas
PASSWORD=123456
```

- we need an npm module called `dotenv`

```js
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//- this reads the .env file into the process.env
```

- We can access these variables everywhee else in our application. We only need to run it once at the start of the app/server.

# Mongo DB

- It is a NoSql database
- A Mongo database contains Collections which you can relate to tables,
- A collection contains Documents which you can relate to rows
- MongoDB is a document database with the scalability and flexibility we need with the querying and indexing that you need
- FEatures

  1. Document based: stores data in documents; field-value data sructures, NoSQL
  2. Scalable: easy to distribute across machines as users and amount data increase
  3. Flexible: No data schema required, each document can contain dfft number and typeof fields
  4. Performant
  5. Open source

- Mongo DB uses BSON data type very similar to JSON but typed.
- Embedding in MongoDB is similar to relationships in RDBMS
- We simply include related data into a single document

- Examples

```json
// Mongo DB
{
    "_id": ObjectID('3456789023456'),
    "title": 'Harry Potter',
    "length": 567,
    "author": "J.K.Rowling",
    "reviews": [
        {"user": "Hrn", "rating": 5},
        {"user": "Bill", "rating": 9}
    ]
}
```

- Relational db use tables, with references: You know how SQL works

### Installing

- Download and install the executible from the mongodb website. Follow instructions or watch a youtube video
- Install the database and the shell. You can install teh MongoDB desktop app that prvides a GUI to work with the database
- Run the MOngoDB server service, by run the `mongod` command, To start runnig the database
- Run the Mongo Shell by runnng `mongosh` or use the MonogDB compass to connect to the database

- Creating a local database

```bash
use database_name; #ccreates database if it doesnt exust
use another_db; #switches ti that db

# creating a document and inserting data
# creates a collection if it doesnt exist
# pass in a JS object
db.tours.insertOne(
{
    name: 'The forst hiker',
    price: 297
}
);

db.tours.insertMany;

# selecting data
db.tours.find();

# show dbs
show dbs;
```

### CRUD operations with MonogDB

1. Creating documents

```shell
db.tours.insertMany([
    {}, {}, {}
]);
```

2. Reading

- we use db.tours.find()
- we can pass in a filter object

```shell
db.tours.find({name:'the forest hiker'});

db.tours.find({price:{$lte:500}}) # lt=less than| gt | gte | operators

# mulitple filters
db.tours.find({price:{$gt:200},rating:{$gte:4.8}})

# one of th conditions: `$or` operator
db.tours.find({$or:[{price:{$lt:500},{rating:{$gte:4.8}}}]});


# select only some fields
db.tours.find({price:400},{name:1})
```

3. Updating

- updateOne function, 1st arg: filter object, 2nd arg: teh update

```shell
db.tours.updateOne({name:'the forst hiker'},{$set:{price:597}})

# updating many
db..tours.updateMany({price:200},{$set:{price:500}})
```

4. Deleting

- Use db.tours.deleteMany()
- Pass in a filter,
  > Passign in an empty object deletes eveerything from the collection

> You can create hosted databases using MongoDB ATLAS which are stored in the cloud and you connect to from any machine th correct api key and password
> Follow online/updated instructions on how to connect to a hosted database

# Using MongoDB with Mongoose JS library

- Monggose allows us to easily interact with the mongo db database from our javascript library

- If you are using a hosted database, follow online instructions to conect. Store any keys and passwords in the `config.env`

```shell
DATABASE_LOCAL=mongodb:localhost:27017/dbname

```

- Connecting mongoose to db

```js
const mongoose = require("mongoose");

// same for both local and hosted, its the connection str that changes
mongoose
  .connect(process.env.DATABASE, {
    useNewUrl: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("Successfully connected to database");
  }).catch(err) => {
    console.log(err)
  })
```

- Mongoose is an ODM(object data modelling) library
- Allows rapid inetractions with a monogdb database
- Schema: to model our data, set default values, validation
- Model: a wrapper for the schmae which orivides an interface to the database for CRUD operations

> Mongoose is just `sequelize` bust only mongoose

1. Creating a schema for the data

```js
//define schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rating: Number,
  price: {
    type: Number,
    required: [true, "error message string"],
  },
});

//make a model out of this schema
const Tour = mongoose.model("Tour", tourSchema);

// this could be done in one statement, actually we may never mentined the word schema
```

- Using mongoose

2. Creating documents and testing connection

```js
const testTourModl = new Tour({
  name: "The forest hiker",
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Back end architecture: MVC, Logic types, etc

- MVC architecture:
  - It is implemented in a variety of ways.
- The application is divided into 3 layers

  1. Model: Businees logic
  2. Controller: Application logic
  3. View: presentation logic

- The controller provides a bridge btn the model and the views. Eg. When a browser rqest for the tours data, the Controller gets the request. Then asks the Model to query for the data, and then asks for the view to generate HTML code based on the data received, then compiles all these and sends back a requst

- Application logic

  - Code that makes the app work, technical stuff
  - A brideg btn layers

- Business logic

  - Code directly overlayed over the business idea
  - MOstly concerned with the business ideas and data

- Refactoring for MVC
- DIRS: /models, /controllers, /views
- The dfft models and controllers export their functionality as JS modules.

3. Reading documents

```js
//model = Tour
await Tour.find(); //- returns all documents

Tour.findById("2345678"); //-pass in an id

Tour.findOne({ _id: "2345678" }); //find one
```

> Note
> The ORM/ORM methods return promises and we need to comsume them professionally i.e in async functions and error handling

4. Updating documents

```js
Tour.findByIdAndUpdate('id3456789', {

}, new: true)
```

5. Creating: `Tour.create()`

> Always use the documentation to see how to best do things. B'se things are changing and better ways of doing things emerge

## Make the API better with filtering, sorting, limiting, pagination, aliasing ,etc

1. Filtering

- We'll use the url style like `/api/v1/tours?duration=5&difficulty=easy
- Express parses this for us: `req.query`

```js
// req.query
{
    duration: '5',
    difficulty: 'easy'
}


//filetring in mongoose
const tours = await find Tour.find({
    duration: 5
})

//or

const tours = await Tour.find().where('duration').equals(5).where()//etc
```

2. Advanced filtering

```js
// the url /api/v1/tours?duration[gte]=5&diff=easy
//produces req.query
{
    duration: {gte: '5'},
    diff: 'easy'
}
```

3. Sorting

- We use a url query of `sort` that we can depend on to prompt the database querying

```js
//url /api/v1/tours?sort=price

let query = Tour.find(JSON.parse(queryStr));

//we can then chain a sort()
if (req.query.sort) query = query.sort(req.query.sort);

// descending orde, we use a negative before the price
/// url /api/v1/tours?sort=-price

//multiple sort queries
///url /api/v1/tours?sort=price,rating
```

> This depends on how best we parse certain url params into the values we use to make related queries to the database, and return related results.

4. Field limiting

- Allow the client side to specify certain fields to be returned by a database query
- This can be easily implemented on the server when querying data,, but we need to depend on the API users' needs
- `/api/v1/tours?fields=name,title,other`

5. Pagination

- Select a range of results out several data rows
- `/api/v1/tours?page=2,limit=10`
- If page=2, then we skip `2*10` results and thoseafter
- We then parse this into a way that the ORM/ODM can use to make queries
- We need a way of knowing the number of results, if the number of results requested plus those skiped is greater than the total number of results, then no data is to be returned

6. Aliasing

- We add a route with most popular actions, e.g findTotalExpense, getMonthlyAnalsys, fiveBstTours

7. Refactoring API features

- we create a class to store all these various functionalities

```js
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //process the querystr

    //add the find methid to teh already existing query
    this.query.find(/*options*/);

    //return the manipulated query
    return this;
  }

  sort() {
    this.query.sort();
    return this;
  }

  limitFields() {}
  paginate() {}
}

//usage
exports.getAllTours = async (req, res) => {
  //execute query
  // we create an instance of the fature class, and we chain the instance level methids to manipulate the queries. Each method returns the object to allow chaining.
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  //Remember: the query is the actual that was returned from the data base, we are simply manipulating it in our desired ways
  //we have to access it at features.query - store it then send to the client
  const tours = await features.query;
};
```

- We need to export this class in another file, that we simply imprt in the file we need

> Very nice application of JS classes

8. MongoDB aggregation pipeline for grouping and matching

```js
async function(req, res){
    const stats = Tour.aggregate([
        $match: {ratings: {$gte: 4.5}},
        $group: {
            _id: null,
            avgRating: {$avg: '$ratings'},
            avgPrice: {$avg: '$price'},
            minPrice: {$min: '$price'},
            maxPrice: {$max: '$price'},
            sumPrice: {$sum: '$price'},
        },
        $sort: {
            avgPrice: 1
        }
    ])
}

// this is an innovative way to imitate the usage of GROUP BY in SQL
```

> Remember to use the MONGODB documentation if you need to.

9. Virtual properties

- Mongoose has a feature of virtual properties, which are fields we define in our model bt never save in the database

10. Document middleware / Hooks

- Mongoose has features of hooks like pre(), post()
- whch are similar to sequelize hooks
- Eg. Harsh the password before inseting, slugify the tile before inserting,parse dates after querying.
- Mongoose uses the idea of middleware stack, and so needs to call the next() function in each middleware
-

- Mongoose also has query middleware, that manipulates the query before or after getting out results
- They use the same idea
- Check out the code files for these examples: `/controllers/tourControllers`

11. Take note of data validation with mongoose
    - Check if data is of the right type
    - Sanitize incoming data
    - Seach about them if you need to.

# Error handling NodeJs and Express.

1. Node debuggin using `ndb`

- ndb is an npm package by google, which is used debug node code
- `npm i ndb -g`
- `ndb entrypoint.js` or add a script in the package.json
- It opens up a chrome instance, from which you control your code execution and edit your source code in oneplCE
- The gist of debugging is setting breakpoints, then we can view the values of variables, scopes, etc
- We can view middleware stack
  View the properties of dfft objects

2. Handling undhandled / undefined routes

- E.g wrong routes or typos in routes

- We use an anonymous middleware at the end of the middleware(after the last middleware).Therefor, this runs after all other middleware have already run

```js
// `all` `*`: run all http methods and all routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
```

3. Overview of error handling

- Two types of errors can happend

  1. Operational errors

  - Problems we can predict will hapen at somepoint, so we handle thm in advance
  - Invalid path accessed,
  - Invalid user input,
  - Failed to connect to server
  - Failed to connect to db
  - Request timeout, etc
  - Often termed as 'exceptions'

  2. Programming errors

  - Bugs that programmers introduce in th code.
  - Difficult to find and handle
  - Reading properties of undefined
  - passing invalid arguments
  - Using await without async
  - Typos

- We will handle operational errors.
- We need to create a global error handling middleware
- all errors in the other functions are sent to the global error handler.
- The error handler will then decide what to do with the error
- This allows us to seperate error-handling from the the business logic

- Implementation
- Express allows us to create error handling middleware by addign a function with 4 args: err, req, res, next

```js
//at the end of script
app.use((err, req, res, next)=>{
  //set defaults:
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'Server error'

  res.status(err.statusCode).json({
    status: err.status,
    msg: err.message
  })
})


//all other functions will simply throw an error, in their error handling blocks
//eg.
app.all('*', (req, res, next) => {
  const new Error(`Couldnt find rout on server`)

  err.status = 'fail'
  err.statusCode = 404

  next(err)
})
```

4. Exporting error handling in an external class

```js
class AppError extends Error {
  constuctor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `statusCode`.startsWith("4") ? "Fail" : "Error";

    //tell if the error s oerational or programmatic: You dont programming error to the client
    this.isOperational = true; //set default true

    //tell where the error occured
    // Dont pollute the stack trace
    //i.e This function call will not feed into the error stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

- Usage of the class

```js
app.all("*", (req, res, next) => {
  next(new AppError(`CAnt find route on server`, 404));
});
```

> Passing a argument to the `next` function inside a middleware, express assumes its an error and skips the rest of middlewarre in the stack, directly into the global error handling middleware

5. Catching errors in async functions

- It is messy to add error handling code in a catch block on every async function
- Lets create a function that we wrap our async functions in, it creates a new fn from the arg function and if there is an error, it responds with the error

```js
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); //this works: .catch(next)
  };
};

//this returns the functions with the req and res objects.
// we need the `next` function to send the error to global error handling middleware

//usage

const createTour = catchAsync(async (req, res) => {
  //create tour code
});
```

- My idea

```js
//error handling wrapper function:

const runAsync = function (fn) {
  //return a function that takes in any number of args and calls the async func with those args
  return (...args) => {
    fn(...args).catch((err) => console.log("custome_err", err));
  };
};

//usage
const login = runAsync(async (name, pwd) => {
  console.log(name, pwd);
});

login("Hiren", "12345");
```

# Authentication, Authorization and Security

1. Create user model, controlllers and add user

2. Managing passwords

- Validate if two input passwords are the same
- Implement an insttance level method that queries the password and compares it with the inout pwd

- Pwds should be encypted to protect them from attacks
- use `bcryptjs` npm package

```js
//npm i bcryptjs
const bcrypt = require("bcrypt");

const hashed = await bcrypt.hash(this.password, 10); //this is asynchronous
```

## Authentication with JWT

- When the user logs in, the server generates a unique JWT token
- The token is sent to the user, and is stored in a cookie or localStorage
- The server doesnt store state/session information
- When the user sends requests to protcted routs, they send the req along with the JWT token
- The server checks if the JWT is valid, if it is valid, data is sent back to the user, if not it errors

## How JWT works

- `jwt.io` website
- The JWT is a string cntainig 3 parts: The header,payload, verify signature

- The payload is where data is stored. It could be accessed by anyone so we can't store sensitive information

1. The signature

- This is a string gnerateed from combinig the header + payload, and a secret string.
- If someone tampers with the data, the signature will change
- If they dont have access to the secret, they cannot generate the same JWT stored for that user.
- So, the verification of the JWT token using a secret and signature is what makes JWT simple but strong security wise

2. Implementation

- Install the `jsonwebtoken` npm package
- Dont forget to search the documentation
- There are fuctions like jwt.sign, .verify, .decode

```js
const jwt = require('jsonwebtoken')

const token = jwt.sign({id: /*adding data, userID*/}, 'this is 4 53creT', {
  expiresIn: '24h'
})
```

3. Logging in users

- Only issue the token if the user credantials are correct.

```js
//login function
function login(req, res, next) {
  const { email, password } = req.body;

  //1) Ckeck if the email n password are provided
  //2) Check iif user exists
  //3) If ok, send token to client
  await bcrypt.compare(provPwd, storedPwd) //retuns boolean
  const token = jwt.sign({id: '234567'}, 'secret', {
    expiresIn: 24h
  })
}

//- store the session token in the database
```

- if you dont the value f the token, we maynot store it in the db, the package can verify it
- But i think, we check for the exact toke that we sent to the user, it is more secur ethis way

4. Protecting routes: allow only authenticated users to get access to certain routes

- We r gonna create a middleware function, that is going to run before the querying midleware for a certain route

```js
function protect(req, res, next){
  //1) Get the token if it is there
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.autorization.split(' ')[1]
  }
  //2) Verify token
  jwt.verify(token, 'secret', /**success callback */)
    //lets promisify this
    const decoded = await util.promisify(jwt.verify)(token, 'secret')

  //3) check if user still exists

  //4) check if user is logged in.
}


```

- In the frontend script, add a `Authorization` header that stores the `Bearer ___token____` value when making the request

5. Restricting certain to only certain users

- we create middleware that runs before the queying midleware
- There is a `currentUser` variable that stores the current user id and the uses role

```js
//we create a wapper function to return the middleware function
function restrictTo(...roles){
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      thrownew Error('No permission to peform action')
    }
  }
}

//usage
router.route(':/id').delete(protect, restrictTo, deleteUser)
```

- we can use the idea in a non-`middleware` approach. We creat ethese function and we runs them as guard cluases inside the query fn

```js
function deleteTour(options) {
  if (!isLoggedIn(options)) return;
  if (!restrictTo(options, "admin")) return;
  //continue with the operation
}

//sample isLoggedIn
function isLoggedIn(options) {
  jwt.verify(options.token, "secret");

  //if issues
  return false;

  //if verified
  return true;
}
```

6. Resetting password

- Create a random token, not a JWT toke, just a token, that you send to the user via email
- Get user based on email or username
- Password reset token

```js
const resetToken = crypto.randomBytes(32).toString("hex");
```

- Never store a plain reset token in the db
- We need to encrypt it to

```js
const encResetToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

const resetToeknExpires = Date.now() + 10 * 60 * 1000;
```

7. Sending emails.

- There are many options and while many are comin up, we often use the `nodemailer` package

8. Password reset functionality

```js
function resetPassword(req, res, next){
  //convert to the same format
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  //check for the user who asked for the reset i.e clicked on the link
  const user = await User.findOne({passwordResetToken: hashedToken})

  //consider token expiry
  //update the password field
  //log the user in
}
```

9. Security best practices

   1. Compromised database - hacker gets access to the db

   - Stronly encrypt passwords with salt and hash

   2. Bruteforce attacks

   - Use bcrypt to slow down login requests
   - Implement rate limiting
   - Max login attempts

   3. XSS atacks

   - Store JWT tokens in hTTPOnly cookie
   - Sanitize user input
   - Set special http haedes

   4. Denial of service

      - Rate limiting
      - Limit body payload
      - Avoi evil regExps

   5. SQL/query injection

   - Sanitize user inout data

   6. Others

   - Use https only
   - Don't send error details to users
   - Prevent cross site request fogery
   - Don't commit sensitive data to source control

10. Sending JWT via cookie

```js
res.cookie("jwt", token, {
  expires: new Date(Date.now + 24 * 60 * 60 * 1000),
  secure: true, //send cookie over only https
  httpOnly: true, //the cookie cannot be accessed or modifed by the browser
});
```

11. Rate limiting

- Prevent massive number of requests from the same IP
- You can implement this by manipulating headers. Store the total rate limit in a header. With every request, keep track of the remaining requests and base on those to implement rate limit

12. Setting secure HTTP headers

- There are packages like `helmet package
- If you want to know more, make esearch

13. Data sanitization

- We try to remove peices of code(that could be executed on the server) from request data,
- Use a package: `xss-clean` and there are other packages to do this for you

# Data modelling

- Process of taking unstructured data taken from a real world scenario and modelling into an organised representation in the database

1. Identify types of relationships
2. Referencing vs. embedding

> MongoDB is a non relational database, but stil needs the idea of refrencing in 1:many relationships
> Applying relationships is dfft from RDBMS and Non-RDBMS

## Nested routes

- eg. `POST /234rt456t/reviews`
- `GET /tour/234567d456a4b/reviews/45678cf4`

```js
router.route("/:tourId/reviews").post();
```

# Server side rendering

1. Server-side vs. cleint side rendeing

- In client side rendering, all the html is rendered on the client side. This needs a data source, from which the client gets the data to render.
- The data is btauned from the API and a client framework/vanilaaJs can generate relevent html markup to render

- In server side rendering, the markup is generated on the server and sent to client for rendering
- For this, we need templates that we inject data into after querying for the data

2. We often use a templating engine to write efficient templates and compilers

- Front end frameworks have in built templating engins like `.vue`, `JSX`, etc
- We can also use a standalone templating engine like 'pug'

- Usage with expess

```js
app.set("view engine", "pug"); // no need to install or require it b'se express does it beneath

//set the directoy of the views
app.set("views", path.join(__dirname), "views");
```

> Use the native `path` to avoid url and reference elated bugs. B'se we dont always know the urls we receive from users

- Pug has a unique syntax that you can get accustomed to. Follow the documentation on their website.
- You have to know how to link/import dfft pug files, how to compile the syntax into valid html

# Other features in the course

1. Addign a map
2. Writing client side Js, and compiling it
3. Connectinng the backend and front end using the fetch API and the `axios` npm package
4. Compiling and bundling using `parcel` npm package
5. Error page rendering

- In the final chapter

1. Omage uploads using the `multer` npm package

- Saving image urls inthe db
- resizing images
- uploading multiple imags

2. Complex email handlers

   - pug templates for emails

3. Credit card paymets using `stripe`

4. Setting up

5. Deployment to `heroku`

> I havenot taken muc time on these b'se they are easily searchable. And with time better alternative come up that i can google or youtube. And whenever, i will want these concepts, i can come back to course.

> Time to go to front end frameworks: React and Vue
