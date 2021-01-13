# what is this?

You will get the node express project structure once you install this as global.

Whenever you want to starts a new node project don't want write all the stuffs. (like angular cli it generates the entire project structure)

Get the express node applications with configured structure (passport, jwt, mongoose, routes and error handling middlewares) for your new projects.

# Installation

`npm install -g express-gen-bot`

# Then

Once you installed the package as globally, go to the directory where you want to generate.

Use the command below.

> exp-app projectname -i
  
With -i you can installed dependencies too inside your project folder.

# image

![How to execute](https://github.com/MohanrajChandrasekar/express_cli/blob/main/src/img1.png?raw=true)

# video will expalin a lot:

<img src="https://github.com/MohanrajChandrasekar/express_cli/blob/main/src/test1.gif" />

run the below commands
  
$ cd <ProjectName>
  
$ npm i --save  // install dependencies or you can provide -i while generate the project like *exp-app projectname -i* this automatically install dependencies
  
$ npm start
  
thats all your node express will started listening on port 3000

# options

express-gen supports 2 options as arguments, both of which are optional:

* *-i* - which install the dependencies automatically.
* *-g* - which initiate the git repository once your project was ready.



