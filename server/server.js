var http = require('http');

var __server;
var __CfClient;
var __appName;

if (!Date.prototype.toCFApiString) {
    (function () {

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        Date.prototype.toCFApiString = function () {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                ' ' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '-00:00';
        };

    } ());
}

/**
 * Start the server
 */
function start(port, client) {
    __CfClient = client;

    __server = http.createServer((request, response) => {
        var reqContext = request.url.substr(1);
        if (!reqContext) {
            writeResponse(response, 200, 'I am alive...');
        } else if ('favicon.ico' == reqContext) {
            writeResponse(response, 200, '');
        } else {
            O.d("Request for: '" + reqContext + "'");
            __CfClient.request('apps?q=name IN ' + reqContext).then((resp) => {
                if (0 == JSON.parse(resp).resources.length) {
                    writeResponse(response, 404, "Could not find app with name '" + reqContext + "'");
                } else {
                    var guid = JSON.parse(resp).resources[0].metadata.guid;
                    O.d('GUID: ' + guid);
                    // go back a week, and get 100 requests
                    var tmpDate = new Date();
                    tmpDate.setDate(tmpDate.getDate() - 7);
                    __CfClient.request('events?actee:' + guid + '&q=timestamp>' + tmpDate.toCFApiString() + '&results-per-page=100&order-direction=desc').then((resp) => {
                        writeResponse(response, 200, resp);
                    }, (e) => {
                        O.e(e);
                        writeResponse(response, 500, "Found GUID '" + guid + "' but could not get env info.");
                    });
                }
            }, (e) => {
                O.e(e);
                writeResponse(response, 500, 'Check logs, could not get request');
            });

        }
    }).on('close', () => {
        O.i('Server closed...');
    }).on('clientError', (ex) => {
        O.e("Client error : '" + ex + "'");
    }).listen(port);

    O.i('Server started on port ' + port);
}

/**
 * Stop the server
 */
function stop() {
    __server.close();
}

/**
 * Given the information, will write the headers and response. All responses are
 * written as 'utf-8' at the moment.
 * 
 * @param {object} response =>
 *            http response object
 * @param {int} statusCode =>
 *            Integer, typically 200, 404 or 500. <b>Will use 500 as the default
 *            statusCode if none is provided</b>
 * @param {JSON} content =>
 *            Content object, <b>will use a text object that indicates no
 *            content has been returned if not provided</b>
 */
function writeResponse(response, statusCode, content) {
    content = content || 'No content returned';
    response.writeHead(statusCode || 500, {
        'Content-Length': content.length,
        'Content-Type': 'application/json'
    });
    response.end(content, 'utf-8');
}

/**
 * All our exports, just stop/start
 */
module.exports = {
    start: start,
    stop: stop
};
