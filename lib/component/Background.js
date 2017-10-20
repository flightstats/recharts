'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _PureRender = require('../util/PureRender');

var _PureRender2 = _interopRequireDefault(_PureRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * @fileOverview Background
                                                                                                                                                                                                                              */


var propTypes = {
  x: _propTypes2.default.number,
  y: _propTypes2.default.number,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  strokeWidth: _propTypes2.default.number,
  stroke: _propTypes2.default.string,
  fill: _propTypes2.default.string,
  className: _propTypes2.default.string
};

function Background(props) {
  var className = props.className,
      others = _objectWithoutProperties(props, ['className']);

  return _react2.default.createElement(
    'g',
    { className: (0, _classnames2.default)('recharts-background', className) },
    _react2.default.createElement('rect', others)
  );
}

exports.default = Background;