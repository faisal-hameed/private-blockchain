# Private Blockchain Web-Service
This is a simple blockchain web service to store data in private blockchain.
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Following technologies are used in this project:
1. Node.js
1. Express framework for web services
2. `express-generator`, to quickly create an application skeleton.
3. LevelDB to persist blocks
4. crypto-js library to encrypt blocks

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].
- Test your node installation by typing below command in terminal
```
node --version
```
It should return node version e.g. `v8.9.4`

### Running Blockchain web service
- Installing project dependencies
```
npm install
```
- Start the application and browse it at : http://localhost:8000  
**Note** : `npm start` will invoke `./bin/www` script which contains web service startup script
```
 npm start
```


## APIs
Following APIs are implemented. Use any REST client to test below APIs

----

### Utility Functions

#### 1. Generate hash
    http://localhost:8000/gateway/hash

    Returns SHA256 hash of data

  * **URL**

    /gateway/hash

  * **Method:**

    `POST`

  *  **Request Body**

     `{"data":"any type of data in string"}`

  * **Success Response:**

    * **Code:** 200 <br />
      **Content:** `{"hash": "3e50d150f89b90f5ddac34b9131380bfed94cf5db8a8de6c8161393b8d5ec5b0"}`

  * **Error Response:**

    * **Code:** 500 Internal Server Error <br />
      **Content:** `{"code":"500","status":"Internal Server Error","message":"data is undefind"}`


#### 2. Generate signature
    http://localhost:8000/gateway/sign/generate

    Generates signature of data by using provided private key

  * **URL**

    /sign/generate

  * **Method:**

    `POST`

  *  **Request Body**

     `{"data": "My secret message", "privateKey": "L4ZYGVyypC1riua7f8SBgVrN6bswk7ufNubaSh7NMLJTpWqcSJv3"}`

  * **Success Response:**

    * **Code:** 200 <br />
      **Content:** `{"signature":"Hw10mwhAH7RaHD1f+aeMt5AcZQHu2e4+H3cF5QTW+g4qTtZoCATg8UKdSR9pbf/DyhFvfwXyIZ6C7qbOcMBpQkM="}`

  * **Error Response:**

    * **Code:** 500 Internal Server Error <br />
      **Content:** `{"code":"500","status":"Internal Server Error","message":"Missing parameters"}`

#### 3. Validate signature
    http://localhost:8000/gateway/sign/validate

    Validate signature

  * **URL**

    /sign/validate

  * **Method:**

    `POST`

  *  **Request Body**

     `{"data" : "My secret message", "walletAddress" : "1CYgQ8wbdWZPGEWgbxZLq5JUe5e1ECWPe7", "signature" : "Hw10mwhAH7RaHD1f+aeMt5AcZQHu2e4+H3cF5QTW+g4qTtZoCATg8UKdSR9pbf/DyhFvfwXyIZ6C7qbOcMBpQkM="}`

  * **Success Response:**

    * **Code:** 200 <br />
      **Content:** `{"isValid":true}`

  * **Error Response:**

    * **Code:** 500 Internal Server Error <br />
      **Content:** `{"code":"500","status":"Internal Server Error","message":"Missing parameters"}`      


### Private blockchain

#### 1. Get block
http://localhost:8000/block/{BLOCK_HEIGHT}
  Returns json data about a single block at height.

* **URL**

  /block/:height

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `height=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"hash":"910bb1155fecdc5cf22f4b70f7805186f9f6de8f5c8d2e05f01f222e82cdea9d","height":0,"body":"First block in the chain - Genesis block","time":"1535137099","previousBlockHash":""}`

* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{"code":"500","status":"Internal Server Error","message":"Block with provided height does not exist"}`
----
#### 2. Post Block
    http://localhost:8000/block

    Returns json data of added block

  * **URL**

    /block

  * **Method:**

    `POST`

  *  **Request Body**

     `{"body":"block body contents"}`

  * **Success Response:**

    * **Code:** 200 <br />
      **Content:** `{"hash":"910bb1155fecdc5cf22f4b70f7805186f9f6de8f5c8d2e05f01f222e82cdea9d","height":0,"body":""New block 1","time":"1535137099","previousBlockHash":"910bb1155fecdc5cf22f4b70f7805186f9f6de8f5c8d2e05f01f222e82cdea9d"}`

  * **Error Response:**

    * **Code:** 500 Internal Server Error <br />
      **Content:** `{"code":"500","status":"Internal Server Error","message":"New block not added"}`
