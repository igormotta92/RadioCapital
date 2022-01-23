//https://expressjs.com/en/resources/middleware/morgan.html

var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream') // version 2.x
const moment = require('moment');

const accessLogStream = rfs.createStream(()=>(
  `access.log-${moment().format('Y-MM-DD')}.log`
), {
  interval: '1d', // rotate daily
  //path: path.join(__dirname, '../../logs')
  path: path.resolve('./logs')
})

morgan.token('date', function() {
  return moment().format();
})

// setup the logger
const format = '[:date] :remote-addr ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"';
//app.use(morgan('combined'));

module.exports = morgan(format, {
  stream: accessLogStream,
  skip: function (req, res) {
    return res.statusCode < 400
   }
});
