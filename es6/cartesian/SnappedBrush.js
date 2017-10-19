'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range2 = require('lodash/range');

var _range3 = _interopRequireDefault(_range2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp; /**
                             * @fileOverview Brush
                             */


var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _d3Scale = require('d3-scale');

var _PureRender = require('../util/PureRender');

var _PureRender2 = _interopRequireDefault(_PureRender);

var _Layer = require('../container/Layer');

var _Layer2 = _interopRequireDefault(_Layer);

var _Text = require('../component/Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Brush = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(Brush, _Component);

  function Brush(props) {
    _classCallCheck(this, Brush);

    var _this = _possibleConstructorReturn(this, (Brush.__proto__ || Object.getPrototypeOf(Brush)).call(this, props));

    _this.getSvgParent = function (target) {
      if (_this.svgParent) {
        return _this.svgParent;
      }

      if (target.parentElement.nodeName === 'svg') {
        _this.svgParent = target.parentElement;
        return target.parentElement;
      }
      return _this.getSvgParent(target.parentElement);
    };

    _this.getClickX = function (e) {
      var target = e.target,
          clientX = e.clientX;

      var svgParent = _this.getSvgParent(target);
      var dim = svgParent.getBoundingClientRect();
      return clientX - dim.left;
    };

    _this.setSnapValues = function () {
      var snapValues = [_this.props.x];
      var bucketWidth = _this.props.width / _this.props.data.length;
      for (var i = 0; i < _this.props.data.length; i++) {
        snapValues.push(snapValues[i] + bucketWidth);
      }
      var len = snapValues.length;
      _this.bucketWidth = bucketWidth;
      _this.snapValues = snapValues;
      _this.maxValue = snapValues[len - 1];
    };

    _this.handleMove = function (e) {
      if (_this.leaveTimer) {
        clearTimeout(_this.leaveTimer);
        _this.leaveTimer = null;
      }

      if (_this.state.isTravellerMoving) {
        _this.handleTravellerMove(e);
      } else if (_this.state.isSlideMoving) {
        _this.handleSlideMove(e);
      }
    };

    _this.handleUp = function () {
      _this.setState({
        isTravellerMoving: false,
        isSlideMoving: false
      });
    };

    _this.handleLeaveWrapper = function () {
      if (_this.state.isTravellerMoving || _this.state.isSlideMoving) {
        _this.leaveTimer = setTimeout(_this.handleUp, 1000);
      }
    };

    _this.handleEnterSlideOrTraveller = function () {
      _this.setState({
        isTextActive: true
      });
    };

    _this.handleLeaveSlideOrTraveller = function () {
      _this.setState({
        isTextActive: false
      });
    };

    _this.handleSlideDown = function (e) {
      _this.setState({
        isTravellerMoving: false,
        isSlideMoving: true,
        slideMoveStartX: _this.getClickX(e)
      });
    };

    _this.nearestSnapValue = function (pageX) {
      return _this.snapValues.reduce(function (prev, curr) {
        return Math.abs(curr - pageX) < Math.abs(prev - pageX) ? curr : prev;
      }, 0);
    };

    _this.travellerDownHandlers = {
      startX: _this.handleTravellerDown.bind(_this, 'startX'),
      endX: _this.handleTravellerDown.bind(_this, 'endX')
    };

    if (props.data && props.data.length) {
      _this.updateScale(props);
    } else {
      _this.state = {};
    }
    return _this;
  }

  _createClass(Brush, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          data = _props.data,
          width = _props.width,
          x = _props.x,
          travellerWidth = _props.travellerWidth,
          startIndex = _props.startIndex,
          endIndex = _props.endIndex;


      if (nextProps.data !== data || nextProps.startIndex !== startIndex || nextProps.endIndex !== endIndex) {
        this.updateScale(nextProps);
      } else if (nextProps.width !== width || nextProps.x !== x || nextProps.travellerWidth !== travellerWidth) {
        this.scale.range([nextProps.x, nextProps.x + nextProps.width - nextProps.travellerWidth]);

        this.updateScale(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.scale = null;

      if (this.leaveTimer) {
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
    }
  }, {
    key: 'getIndex',
    value: function getIndex(_ref) {
      var startX = _ref.startX,
          endX = _ref.endX;

      var min = Math.min(startX, endX);
      var max = Math.max(startX, endX);
      var minIndex = this.snapValues.indexOf(this.nearestSnapValue(min));
      var maxIndex = this.snapValues.indexOf(this.nearestSnapValue(max)) - 1;
      return {
        startIndex: minIndex,
        endIndex: maxIndex
      };
    }
  }, {
    key: 'getTextOfTick',
    value: function getTextOfTick(index) {
      var _props2 = this.props,
          data = _props2.data,
          tickFormatter = _props2.tickFormatter,
          dataKey = _props2.dataKey;

      var text = data[index] && dataKey ? data[index][dataKey] : index;

      return (0, _isFunction3.default)(tickFormatter) ? tickFormatter(text) : text;
    }
  }, {
    key: 'handleSlideMove',
    value: function handleSlideMove(e) {
      var _state = this.state,
          slideMoveStartX = _state.slideMoveStartX,
          startX = _state.startX,
          endX = _state.endX;
      var _props3 = this.props,
          x = _props3.x,
          width = _props3.width,
          onChange = _props3.onChange;

      var pageX = this.getClickX(e);
      var startNearest = this.nearestSnapValue(slideMoveStartX);
      var eventNearest = this.nearestSnapValue(pageX);

      if (startNearest !== eventNearest) {
        var diff = startNearest - eventNearest;
        var newStartX = Math.max(startX - diff, x);
        var newEndX = Math.min(endX - diff, this.maxValue);

        var newIndex = this.getIndex({
          startX: newStartX,
          endX: newEndX
        });

        this.setState({
          startX: newStartX,
          endX: newEndX,
          slideMoveStartX: pageX
        }, function () {
          if (onChange) {
            onChange(newIndex);
          }
        });
      }
    }
  }, {
    key: 'handleTravellerDown',
    value: function handleTravellerDown(id, e) {
      this.setState({
        isSlideMoving: false,
        isTravellerMoving: true,
        movingTravellerId: id,
        brushMoveStartX: e.pageX
      });
    }
  }, {
    key: 'handleTravellerMove',
    value: function handleTravellerMove(e) {
      var _state2 = this.state,
          brushMoveStartX = _state2.brushMoveStartX,
          movingTravellerId = _state2.movingTravellerId;

      var prevValue = this.state[movingTravellerId];
      var _props4 = this.props,
          x = _props4.x,
          width = _props4.width,
          onChange = _props4.onChange;

      var params = { startX: this.state.startX, endX: this.state.endX };
      var pageX = this.getClickX(e);
      var newValue = this.nearestSnapValue(pageX);
      var otherValue = this.state.startX;

      if (movingTravellerId === 'startX') {
        otherValue = this.state.endX;
      }

      if (otherValue !== newValue) {
        var _setState;

        params[movingTravellerId] = newValue;
        var newIndex = this.getIndex(params);

        this.setState((_setState = {}, _defineProperty(_setState, movingTravellerId, newValue), _defineProperty(_setState, 'brushMoveStartX', pageX), _setState), function () {
          if (onChange) {
            onChange(newIndex);
          }
        });
      }
    }
  }, {
    key: 'updateScale',
    value: function updateScale(props) {
      var data = props.data,
          startIndex = props.startIndex,
          endIndex = props.endIndex,
          x = props.x,
          width = props.width;


      if (data && data.length) {
        var len = data.length + 1;
        this.scale = (0, _d3Scale.scalePoint)().domain((0, _range3.default)(0, len)).range([x, x + width]);
        this.setSnapValues();
        this.state = {
          isTextActive: false,
          isSlideMoving: false,
          isTravellerMoving: false,
          startX: this.nearestSnapValue(this.scale(startIndex)),
          endX: this.nearestSnapValue(this.scale(endIndex))
        };
      }
    }
  }, {
    key: 'renderBackground',
    value: function renderBackground() {
      var _props5 = this.props,
          x = _props5.x,
          y = _props5.y,
          width = _props5.width,
          height = _props5.height,
          fill = _props5.fill,
          stroke = _props5.stroke;


      return _react2.default.createElement('rect', {
        stroke: stroke,
        fill: fill,
        x: x,
        y: y,
        width: width,
        height: height
      });
    }
  }, {
    key: 'renderTraveller',
    value: function renderTraveller(startX, id) {
      var _props6 = this.props,
          y = _props6.y,
          travellerWidth = _props6.travellerWidth,
          height = _props6.height,
          stroke = _props6.stroke;

      var lineY = Math.floor(y + height / 2) - 1;
      var x = Math.max(startX, this.props.x) - travellerWidth / 2;

      return _react2.default.createElement(
        _Layer2.default,
        {
          className: 'recharts-brush-traveller',
          onMouseEnter: this.handleEnterSlideOrTraveller,
          onMouseLeave: this.handleLeaveSlideOrTraveller,
          onMouseDown: this.travellerDownHandlers[id],
          style: { cursor: 'col-resize' }
        },
        _react2.default.createElement('rect', {
          x: x,
          y: y,
          width: travellerWidth,
          height: height,
          fill: stroke,
          stroke: 'none'
        }),
        _react2.default.createElement('line', {
          x1: x + 1,
          y1: lineY,
          x2: x + travellerWidth - 1,
          y2: lineY,
          fill: 'none',
          stroke: '#fff'
        }),
        _react2.default.createElement('line', {
          x1: x + 1,
          y1: lineY + 2,
          x2: x + travellerWidth - 1,
          y2: lineY + 2,
          fill: 'none',
          stroke: '#fff'
        })
      );
    }
  }, {
    key: 'renderSlide',
    value: function renderSlide(startX, endX) {
      var _props7 = this.props,
          y = _props7.y,
          height = _props7.height,
          stroke = _props7.stroke;


      return _react2.default.createElement('rect', {
        className: 'recharts-brush-slide',
        onMouseEnter: this.handleEnterSlideOrTraveller,
        onMouseLeave: this.handleLeaveSlideOrTraveller,
        onMouseDown: this.handleSlideDown,
        style: { cursor: 'move' },
        stroke: 'none',
        fill: stroke,
        fillOpacity: 0.2,
        x: Math.min(startX, endX),
        y: y,
        width: Math.abs(endX - startX),
        height: height
      });
    }
  }, {
    key: 'renderText',
    value: function renderText() {
      var _props8 = this.props,
          startIndex = _props8.startIndex,
          endIndex = _props8.endIndex,
          data = _props8.data,
          y = _props8.y,
          height = _props8.height,
          travellerWidth = _props8.travellerWidth,
          stroke = _props8.stroke,
          tickFormatter = _props8.tickFormatter;
      var _state3 = this.state,
          startX = _state3.startX,
          endX = _state3.endX;

      var offset = 5;
      var style = {
        pointerEvents: 'none',
        fill: stroke
      };

      return _react2.default.createElement(
        _Layer2.default,
        { className: 'recharts-brush-texts' },
        _react2.default.createElement(
          _Text2.default,
          {
            textAnchor: 'end',
            verticalAnchor: 'middle',
            style: style,
            x: Math.min(startX, endX) - offset,
            y: y + height / 2
          },
          this.getTextOfTick(startIndex)
        ),
        _react2.default.createElement(
          _Text2.default,
          {
            textAnchor: 'start',
            verticalAnchor: 'middle',
            style: style,
            x: Math.max(startX, endX) + travellerWidth + offset,
            y: y + height / 2
          },
          this.getTextOfTick(endIndex)
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props9 = this.props,
          x = _props9.x,
          width = _props9.width,
          data = _props9.data,
          className = _props9.className;
      var _state4 = this.state,
          startX = _state4.startX,
          endX = _state4.endX,
          isTextActive = _state4.isTextActive,
          isSlideMoving = _state4.isSlideMoving,
          isTravellerMoving = _state4.isTravellerMoving;


      if (!data || !data.length) {
        return null;
      }

      var layerClass = (0, _classnames2.default)('recharts-brush', className);

      return _react2.default.createElement(
        _Layer2.default,
        {
          className: layerClass,
          onMouseUp: this.handleUp,
          onMouseMove: this.handleMove,
          onMouseLeave: this.handleLeaveWrapper
        },
        this.renderBackground(),
        this.renderSlide(startX, endX),
        this.renderTraveller(startX, 'startX'),
        this.renderTraveller(endX, 'endX'),
        (isTextActive || isSlideMoving || isTravellerMoving) && this.renderText()
      );
    }
  }]);

  return Brush;
}(_react.Component), _class2.displayName = 'Brush', _class2.propTypes = {
  className: _propTypes2.default.string,

  fill: _propTypes2.default.string,
  stroke: _propTypes2.default.string,
  x: _propTypes2.default.number.isRequired,
  y: _propTypes2.default.number.isRequired,
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  travellerWidth: _propTypes2.default.number,

  dataKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  data: _propTypes2.default.array,
  startIndex: _propTypes2.default.number,
  endIndex: _propTypes2.default.number,
  tickFormatter: _propTypes2.default.func,

  onChange: _propTypes2.default.func
}, _class2.defaultProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 40,
  travellerWidth: 5,
  fill: '#fff',
  stroke: '#666'
}, _temp)) || _class;

exports.default = Brush;