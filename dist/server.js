"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _express = _interopRequireDefault(require("express"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _cors = _interopRequireDefault(require("cors"));

var _App = _interopRequireDefault(require("../src/App"));

var _index = require("../src/weather-service/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PORT = process.env.NODE_ENV === 'production' ? 8080 : 4000;
const app = (0, _express.default)();

const router = _express.default.Router();

const serverRenderer = (req, res, next) => {
  _fs.default.readFile(_path.default.resolve('./build/index.html'), 'utf8', async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    const currentWeather = await (0, _index.getWeather)(req.query.city || 'Copenhagen');
    return res.send(data.replace('<div id="root"></div>', `<div id="root">${_server.default.renderToString(_react.default.createElement(_App.default, {
      data: currentWeather
    }))}</div>`));
  });
};

router.use('^/$', serverRenderer);
router.use(_express.default.static(_path.default.resolve(__dirname, '..', 'build'), {
  maxAge: '30d'
}));
app.use((0, _cors.default)()); // tell the app to use the above rules

app.use(router);
app.get('/get-weather', async (req, res) => {
  try {
    const weather = await (0, _index.getWeather)(req.query.city);
    res.json(weather);
  } catch (err) {
    console.log(err);
  }
});
app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});