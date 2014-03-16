/*global openweatherIcons*/

'use strict';

/**
 * Fetch JSON from a given url and return a {Promise}
 *
 * @param  {String} url
 * @return {Promise}
 */
function getJSON(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();

        req.open('GET', url);

        req.addEventListener('load', function () {
            if (this.status === 200) {
                try {
                    resolve(JSON.parse(this.response));
                } catch (error) { // SyntaxError
                    reject(error);
                }
            } else {
                reject(new Error(this.statusText));
            }
        });

        req.addEventListener('error', function (error) {
            reject(new Error('Network Error: ' + error.message));
        });

        req.send();
    });
}

/**
 * Resolve current position using Geolocation API and return a {Promise}
 *
 * @return {Promise}
 */
function getPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(function (position) {
            resolve(position);
        }, function (error) {
            reject(error);
        });
    });
}

/**
 * Fetch current weather and update browser action badge
 */
function fetchWeather() {
    getPosition()
    .then(function(position) {
        var lat = position.coords.latitude.toFixed(2),
        lng = position.coords.longitude.toFixed(2);

        return getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=' + localStorage.units + '&cnt=1&lang=' + localStorage.lang);
    })
    .then(function(response) {
        var weather = response.weather[0],
            temp = response.main.temp.toFixed(0);

        chrome.browserAction.setTitle({ title: weather.description + ', ' + temp + '°' + ((localStorage.units === 'metric') ? 'C' : 'F') });

        openweatherIcons.makeBrowserActionIcon({code: weather.id, sunset: response.sys.sunset}, temp + '°')
        .then(function (icon) {
            chrome.browserAction.setIcon({ imageData: icon });
        });
    })
    .catch(function(error) {
        chrome.browserAction.setIcon({ path: openweatherIcons.getNAIcon() });

        console.error('Argh, broken: ', error);
    });
}

function scheduleRequest() {
    chrome.alarms.create('refresh', {periodInMinutes: 15});
}

function onAlarm(alarm) {
    if (alarm && alarm.name === 'refresh') {
        fetchWeather();
        scheduleRequest();
    }
}

function onInit() {
    fetchWeather();
    scheduleRequest();
}

chrome.i18n.getAcceptLanguages(function (languages) {
    // TODO: Language and units system detection requires more robust solution or config page
    localStorage.units = (languages[1] === 'en') ? 'imperial' : 'metric';
    localStorage.lang = languages[1];
});

chrome.alarms.onAlarm.addListener(onAlarm);

chrome.runtime.onInstalled.addListener(onInit);
chrome.runtime.onStartup.addListener(onInit);
