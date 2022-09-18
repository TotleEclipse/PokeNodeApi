# PokeNode

This project was created as an exercice for a training on Node.js technology.
**https://www.udemy.com/course/nodejs-le-guide/**

To run this project use the following command line :

**yarn start**

To configure the secure server :

Be sure to install openssl on your computer **(https://www.openssl.org/)**
Inside the certificates folder, run the following command : **openssl req -nodes -new -x509 -keyout server.key -out server.cert**. This command line must generate two new files : server.cert and server.key
In the .env file, be sure the environement variable SECURE is equal to 1