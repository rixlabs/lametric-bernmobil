const express = require('express')
const app = express()
const axios = require('axios');
const moment = require('moment');

process.env.TZ = 'Europe/Zurich' 

//const bus_stop = '8589008'; //Bern Wyleregg

const stationBoardAPI = 'http://transport.opendata.ch/v1/stationboard?limit=4&type=departure&transportations[]=bus&id=';


app.use('/station', function(req, res, next) {
    const nowPlusOneM = moment().add(2, 'm').format('YYYY-MM-DD k:mm');
    
    axios.get(stationBoardAPI+req.query.stationId+'&datetime='+nowPlusOneM)
      .then(function (response) {

        const connections = response.data.stationboard.map((c, index) => {
            return {
                text: c.to.replace(/Bern,?/g, '')+' '+moment(c.stop.departure).fromNow(),
                icon: 'i3525',
                index: index
                
            }
          })
          //connections.unshift({text: 'BUS', icon: 'i3525', index: 0});
          const frame = {
              frames: connections
          }
          res.send(frame);
        
      })
      .catch(function (error) {
        console.log(error);
      });

});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});