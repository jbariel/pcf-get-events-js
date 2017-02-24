# PCF Get Events
Simple NodeJS app that will display the last 100 events for a given application name.

## Required Environment Variables for a PCF Deploy
If you are deploying this into PCF, you must provide the following environment variables.

* `API_PROTOCOL` => `http` or `https`
* `API_HOST` => Set to the API endpoint - typically `api.<systemDomain>`
* `API_USERNAME` => Set to an API admin, typically `admin`
* `API_PASSWORD` => Set to the password for the given `API_USERNAME`
* `SKIP_SSL_VALIDATION` => Set to `true` when using self-signed certs
* `PORT` => Port the app should run on

### Clone and run

It's very simple to get this project up and running:

* Clone the repo
* Install dependencies `npm install`
* Configure your `props.json`
* Run the project `node index.js`

## JS CFClient
This project is based on the [js-cfclient](https://github.com/jbariel/js-cfclient) NPM.  See more information there.

You can also see other examples in the [cfclient-server-js](https://github.com/jbariel/cfclient-server-js) project.

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.
