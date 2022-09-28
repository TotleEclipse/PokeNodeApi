# PokeNode

This project was designed in the context of a training about Node.js technology.
**https://www.udemy.com/course/nodejs-le-guide/**

To start this application locally on your computer, use the following command line :

**yarn start**

To configure the secure server (HTTPS) during development, you can use a self-seigned certificate:

- Be sure to install openssl on your computer **(https://www.openssl.org/)**

- Inside the certificates folder, run the following command : 

    **openssl req -nodes -new -x509 -keyout server.key -out server.cert**. 
    
    This command line must generate two new files : server.cert and server.key
    
- In the .env file, be sure the environement variable SECURE is equal to 1
