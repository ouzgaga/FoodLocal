# Infrastructure Local Food

![](./Graphs/Infrastructure.png)	

In our App we will separate our Business tier in two applications.

## Main application

The main application will be the application were you can found local producer and market around you.

## Management App

The management application will be for the producer and the administrator of the main application. This part will provide an other design, more orented management. 

### Why separate the two applications

The Main App will normally more used to get information and will be used more often then the Manage App. But the Manage App will need longer session and will do more upload. 
If we think about having more then one server and doing load balancing, it's interesting to separate both part.

If we have maintenance on the management part, the Main App will still be working.

## DataBase

The DB will be in a other server and will be able to be duplicate

## Docker

Every server will be in a docker image to duplicate them easily and make the development easier.

We will need a Reverse Proxy to manage the load balancing and the redirection.