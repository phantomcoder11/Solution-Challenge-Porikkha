# porikha

To use the app on local host , follow the steps as directed:

1. Clone the application on a local folder 

$ git clone -b master <git_hub_link>

2. Direct to the front-restored-1 folder

$ cd front-restored-1

3. Install the npm modules

$ npm install

4. Go to the client directory

$ npm install

5.Return to the root directory

cd ../

6. Go to the directory

cd ./client/src/components/studentAuth/auth.js

7. On line 28 at ./client/src/components/studentAuth/auth.js,

Change -> 
const response = await axios.post(
     'https://thawing-inlet-03435.herokuapp.com/student/login',
     data
  );
to ->
const response = await axios.post(
     'http://localhost:5000/student/login',
      data
 );
 
8. On line 90 at ./client/src/components/studentAuth/auth.js,
   Change->
    clientId='754763699582-i6l0gqb6ffj80i77un15s743ti10bej0.apps.googleusercontent.com'
   to->
    clientId='683145953672-oc94svc2ngglohb86jm50i9ft47kh6qm.apps.googleusercontent.com'
    
9. On the env file:

Change ->
   OUTHTOKEN=754763699582-i6l0gqb6ffj80i77un15s743ti10bej0.apps.googleusercontent.com
to->
   OUTHTOKEN=683145953672-oc94svc2ngglohb86jm50i9ft47kh6qm.apps.googleusercontent.com
   
10. Once all modules are install , use the command to run the application::

$ npm run devStart 


# Visit http://localhost:3000
