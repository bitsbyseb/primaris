# **Primaris: Secure Home Cloud Service**
## Set up your own home cloud service in your home

Primaris lets you set up a tiny and simple home cloud service, it is built for develovers due to its focusing on code preview, you can upload any file by the way, i'll be working on future other preview services for files such like PDF, word, excel, power point,etc.

## Steps to set up the environment
Ensure you have nodejs and denojs installed for this project.
**Disclaimer** i know that it isn't a good practice the fact of using two runtimes in the same project, i started the project from the backend in HonoJS using Denojs, and then i created the frontend using vite because i didn't find something like i wanted in deno environment, i'll try to use neither deno or nodejs.

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