require('dotenv').config();
const express = require('express');
const ipinfo = require('ipinfo');
const weather = require('openweather-apis');
// const Weatherbit = require('weatherbit');
const requestIp = require('request-ip');

const app = express();


weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(process.env.OPENWEATHER_API);


app.get('/api/hello', async (req, res) => {
    try {
        const { visitor_name } = req.query;
        const ip = requestIp.getClientIp(req);
        // console.log(ip, 'IPPPPPPPP');
        ipinfo(ip, process.env.IPINFO_TOKEN, async (err, where) => {
            if (err) {
                return res.status(500).send('Error retrieving location data');
            }

            if (!where.loc) {
                console.error('Location data does not contain "loc" property.');
                return res.status(500).send('Error retrieving location data');
            }

            const [latitude, longitude] = where.loc.split(',');
            console.log([latitude, longitude]);

            weather.setCoordinate(latitude, longitude);
            weather.getAllWeather((err, weatherData) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error retrieving weather data');
                }

                res.status(200).json({
                    "client_ip": ip,
                    "location": where.city,
                    "greeting": `Hello ${visitor_name}!, the temperature is ${weatherData.main.temp} degrees Celcius in ${where.city}`,
                });
            });
        });
    } catch (error) {

    }
})


app.listen(3000, () => {
    console.log('HNG listening on port 3000');
});
