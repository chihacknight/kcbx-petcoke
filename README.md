# About this project

This is an application to monitor wind speed in Chicago's Tenth Ward surrounding KCBX Terminals, a bulk freight facility which maintains and transports large piles of [petroleum coke](http://en.wikipedia.org/wiki/Petroleum_coke) ("petcoke"). Residents have been told by the Chicago Department of Public Health to be mindful of windy days, as the petcoke dust becomes airborne and can aggravate respiratory conditions. The app will be collecting data on wind speed and air quality and alerting residents via SMS when potentially hazardous conditions exist.

This is a project of the [Open Government Hack Night](opengovhacknight.org), and is released under the [MIT License](http://opensource.org/licenses/MIT).

# Contributing

Pull requests are welcome. If you are interested in contributing a patch, please fork the repository and submit a PR. If you are interested in taking on a larger role in the project, send us a message or drop into the [Open Government Hack Night](opengovhacknight.org).

# Setting up your dev environment

* After cloning the repository and running `npm install`, copy the file `lib/_ENVVARS.template.js` to `lib/_ENVVARS.js`.
* You will need to obtain a free API key from [forecast.io](https://developer.forecast.io/register) and place that key in _ENVVARS.js for the variable FORECAST_IO_API_KEY.
* If you don't already have it, you'll need to install the grunt CLI by running `npm install -g grunt-cli`.
* Start the local server by running `grunt serve`
* Access the site at http://localhost:3000

# MIT License

Copyright (c) 2015 Benjamin Wilhelm, [Open City Apps](http://opencityapps.org/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
