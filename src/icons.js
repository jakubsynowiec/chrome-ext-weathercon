var openweatherIcons = (function () {
    'use strict';

    var prefix = 'icons/badge/',
        icons = {
            na: 'na',
            day: {
                'c200': 'tstorm1',    // thunderstorm with light rain
                'c201': 'tstorm2',    // thunderstorm with rain
                'c202': 'tstorm3',    // thunderstorm with heavy rain
                'c210': 'tstorm1',    // light thunderstorm
                'c211': 'tstorm2',    // thunderstorm
                'c212': 'tstorm3',    // heavy thunderstorm
                'c221': 'tstorm3',    // ragged thunderstorm
                'c230': 'tstorm1',    // thunderstorm with light drizzle
                'c231': 'tstorm2',    // thunderstorm with drizzle
                'c232': 'tstorm3',    // thunderstorm with heavy drizzle
                'c300': 'shower1',    // light intensity drizzle
                'c301': 'shower2',    // drizzle
                'c302': 'shower3',    // heavy intensity drizzle
                'c310': 'shower1',    // light intensity drizzle rain
                'c311': 'shower2',    // drizzle rain
                'c312': 'shower3',    // heavy intensity drizzle rain
                'c321': 'shower3',    // shower drizzle
                'c500': 'shower1',    // light rain
                'c501': 'shower2',    // moderate rain
                'c502': 'light_rain', // heavy intensity rain
                'c503': 'shower3',    // very heavy rain
                'c504': 'shower3',    // extreme rain
                'c511': 'sleet',      // freezing rain
                'c520': 'shower1',    // light intensity shower rain
                'c521': 'shower2',    // shower rain
                'c522': 'shower3',    // heavy intensity shower rain
                'c600': 'snow1',      // light snow
                'c601': 'snow3',      // snow
                'c602': 'snow5',      // heavy snow
                'c611': 'sleet',      // sleet
                'c621': 'snow3',      // shower snow
                'c701': 'mist',       // mist
                'c711': 'fog',        // smoke
                'c721': 'fog',        // haze
                'c731': 'fog',        // sand/dust whirls
                'c741': 'fog',        // fog
                'c800': 'sunny',      // sky is clear
                'c801': 'cloudy1',    // few clouds
                'c802': 'cloudy3',    // scattered clouds
                'c803': 'cloudy5',    // broken clouds
                'c804': 'overcast',   // overcast clouds
                'c906': 'hail'        // hail
            },
            night: {
                'c200': 'tstorm1_night',    // thunderstorm with light rain
                'c201': 'tstorm2_night',    // thunderstorm with rain
                'c202': 'tstorm3',          // thunderstorm with heavy rain
                'c210': 'tstorm1_night',    // light thunderstorm
                'c211': 'tstorm2_night',    // thunderstorm
                'c212': 'tstorm3',          // heavy thunderstorm
                'c221': 'tstorm3',          // ragged thunderstorm
                'c230': 'tstorm1_night',    // thunderstorm with light drizzle
                'c231': 'tstorm2_night',    // thunderstorm with drizzle
                'c232': 'tstorm3',          // thunderstorm with heavy drizzle
                'c300': 'shower1_night',    // light intensity drizzle
                'c301': 'shower2_night',    // drizzle
                'c302': 'shower3',          // heavy intensity drizzle
                'c310': 'shower1_night',    // light intensity drizzle rain
                'c311': 'shower2_night',    // drizzle rain
                'c312': 'shower3',          // heavy intensity drizzle rain
                'c321': 'shower3',          // shower drizzle
                'c500': 'shower1_night',    // light rain
                'c501': 'shower2_night',    // moderate rain
                'c502': 'light_rain',       // heavy intensity rain
                'c503': 'shower3',          // very heavy rain
                'c504': 'shower3',          // extreme rain
                'c511': 'sleet',            // freezing rain
                'c520': 'shower1_night',    // light intensity shower rain
                'c521': 'shower2_night',    // shower rain
                'c522': 'shower3',          // heavy intensity shower rain
                'c600': 'snow1_night',      // light snow
                'c601': 'snow3_night',      // snow
                'c602': 'snow5',            // heavy snow
                'c611': 'sleet',            // sleet
                'c621': 'snow3_night',      // shower snow
                'c701': 'mist_night',       // mist
                'c711': 'fog_night',        // smoke
                'c721': 'fog_night',        // haze
                'c731': 'fog_night',        // sand/dust whirls
                'c741': 'fog_night',        // fog
                'c800': 'sunny_night',      // sky is clear
                'c801': 'cloudy1_night',    // few clouds
                'c802': 'cloudy3_night',    // scattered clouds
                'c803': 'cloudy5',          // broken clouds
                'c804': 'overcast',         // overcast clouds
                'c906': 'hail'              // hail
            }
        };

        return {
            getIcon: function (condiion, sunset) {
                return prefix + ((sunset < (new Date().getTime() / 1000).toFixed(0)) ? icons.night['c' + condiion] || icons.na : icons.day['c' + condiion] || icons.na) + '.png';
            },
            getNAIcon: function () {
                return prefix + icons.na + '.png';
            },
            makeBrowserActionIcon: function (weather, text) {
                var icon = this.getIcon(weather.code, weather.sunset);

                return new Promise(function (resolve, reject) {
                    var canvas = document.createElement('canvas'),
                        context = canvas.getContext('2d'),
                        img = new Image();

                    img.src = icon;
                    img.addEventListener('load', function () {
                        context.drawImage(img, 0, 0);

                        if (text) {
                            context.font = 'bold 8pt sans-serif';
                            context.fillStyle = 'rgba(30, 30, 31, 0.75)';
                            context.textAlign = 'right';
                            context.textBaseline = 'bottom';
                            context.fillText(text, 19, 19);
                        }

                        resolve(context.getImageData(0, 0, 19, 19));
                    });
                });
            }
        };
})();
