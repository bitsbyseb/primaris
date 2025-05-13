# **Primaris: Secure Home Cloud Service**
## Set up your own home cloud service in your home

Primaris lets you set up a tiny and simple home cloud service, it is built for develovers due to its focusing on code preview, you can upload any file by the way, i'll be working on future other preview services for files such like PDF, word, excel, power point,etc.

## Steps to set up the environment
Ensure you have nodejs installed for this project.

first of all execute the next command on each folder:
```
npm install
```

go to backend folder and create a .env file with the following content:
```
storageFolder="<path to your storage folder>"
```

go to frontend folder and create a .env file with the following content:
```
serviceUrl="<url of the backend>"
```

then execute the following commands in different command line interpreters:
* start backend:
```
node --run dev:backend
```

* start frontend:
```
node --run dev:frontend
```