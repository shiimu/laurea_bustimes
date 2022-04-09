const router = require('express').Router();
const axios = require("axios");
const { json } = require('express/lib/response');

router.get('/', (req, res) => {
    res.render('index',  {stopname: null, shortname: null, departuretime: null});
});

router.post("/", async (req, res) => {
    const busID = req.body.stopid;

    try{
         await axios({
            url: `https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql`,
            method: 'POST',
            Header: {
                'Content-Type': 'application/graphql'
            },
            data: {
                query: `{
                    stop(id: "${(busID)}"){
                      name
                       stoptimesWithoutPatterns{
                        realtimeDeparture
                            serviceDay
                               headsign
                                trip{
                                    route{
                                         shortName
                                        }
                                    }
                                }
                            }
                        }
                    }`
                }

        }).then((result) => (result.data))
        .then(data => {
                const datawrap = data['data']
                const stopwrap = datawrap['stop']
                const stopName = stopwrap['name']
                const stoptwrap = stopwrap['stoptimesWithoutPatterns'][0]['headsign']
                const deptime = stopwrap['stoptimesWithoutPatterns'][0]['realtimeDeparture']
                const currentday = stopwrap['stoptimesWithoutPatterns'][0]['serviceDay']
                const bustime = currentday + deptime
                const currenttime = new Date().getTime() / 1000
                const timeLeft = bustime - currenttime
                const leftforbus = (timeLeft / 60).toFixed()

                console.log(currenttime, bustime,timeLeft)
                res.render('index', {stopname : "Stop Name: " + stopName, shortname: "Bus Name: " +stoptwrap, departuretime: "Departure Time: " + leftforbus + " Minutes left"})
        });
    }
    catch (error) {
        res.render('index', {stopname: 'Bus not found',shortname: null, departuretime: null})
        console.log(error);
    }
})

module.exports = router;