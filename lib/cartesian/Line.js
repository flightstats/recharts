'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp; /**
                             * @fileOverview Line
                             */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactSmooth = require('react-smooth');

var _reactSmooth2 = _interopRequireDefault(_reactSmooth);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _PureRender = require('../util/PureRender');

var _PureRender2 = _interopRequireDefault(_PureRender);

var _Curve = require('../shape/Curve');

var _Curve2 = _interopRequireDefault(_Curve);

var _Dot = require('../shape/Dot');

var _Dot2 = _interopRequireDefault(_Dot);

var _Layer = require('../container/Layer');

var _Layer2 = _interopRequireDefault(_Layer);

var _Text = require('../component/Text');

var _Text2 = _interopRequireDefault(_Text);

var _ReactUtils = require('../util/ReactUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FACTOR = 1.0000001;

var Line = (0, _PureRender2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(Line, _Component);

  function Line(props, ctx) {
    _classCallCheck(this, Line);

    var _this = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, props, ctx));

    _this.handleAnimationEnd = function () {
      _this.setState({ isAnimationFinished: true });
    };

    _this.handleAnimationStart = function () {
      _this.setState({ isAnimationFinished: false });
    };

    var points = props.points;

    _this.state = {
      isAnimationFinished: true,
      totalLength: 0
    };
    return _this;
  }
  /* eslint-disable  react/no-did-mount-set-state */


  _createClass(Line, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var isAnimationActive = this.props.isAnimationActive;


      if (!isAnimationActive) {
        return;
      }

      var totalLength = this.getTotalLength();

      this.setState({ totalLength: totalLength });
    }
    /* eslint-disable  react/no-did-update-set-state */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _props = this.props,
          animationId = _props.animationId,
          points = _props.points;


      if (animationId !== prevProps.animationId || points !== prevProps.points) {
        var cur = this.getTotalLength();
        var totalLength = prevState.totalLength;
        // A hack method to trigger animation

        this.setState({
          totalLength: cur === totalLength ? cur * FACTOR : cur
        });
      }
    }
  }, {
    key: 'getTotalLength',
    value: function getTotalLength() {
      var curveDom = (0, _reactDom.findDOMNode)(this.refs.animate);
      var totalLength = curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;

      return totalLength;
    }
  }, {
    key: 'getStrokeDasharray',
    value: function getStrokeDasharray(length, totalLength, lines) {
      var lineLength = lines.reduce(function (pre, next) {
        return pre + next;
      });

      var count = parseInt(length / lineLength, 10);
      var remainLength = length % lineLength;
      var restLength = totalLength - length;

      var remainLines = [];
      for (var i = 0, sum = 0;; sum += lines[i], ++i) {
        if (sum + lines[i] > remainLength) {
          remainLines = [].concat(_toConsumableArray(lines.slice(0, i)), [remainLength - sum]);
          break;
        }
      }

      var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];

      return [].concat(_toConsumableArray(this.repeat(lines, count)), _toConsumableArray(remainLines), emptyLines).map(function (line) {
        return line + 'px';
      }).join(', ');
    }
  }, {
    key: 'repeat',
    value: function repeat(lines, count) {
      var linesUnit = lines.length % 2 !== 0 ? [].concat(_toConsumableArray(lines), [0]) : lines;
      var result = [];

      for (var i = 0; i < count; ++i) {
        result = [].concat(_toConsumableArray(result), _toConsumableArray(linesUnit));
      }

      return result;
    }
  }, {
    key: 'renderLabelItem',
    value: function renderLabelItem(option, props, value) {
      var labelItem = void 0;

      if (_react2.default.isValidElement(option)) {
        labelItem = _react2.default.cloneElement(option, props);
      } else if ((0, _isFunction3.default)(option)) {
        labelItem = option(props);
      } else {
        labelItem = _react2.default.createElement(
          _Text2.default,
          _extends({
            key: props.key
          }, props, {
            className: 'recharts-line-label'
          }),
          value
        );
      }

      return labelItem;
    }
  }, {
    key: 'renderLabels',
    value: function renderLabels() {
      var _this2 = this;

      var isAnimationActive = this.props.isAnimationActive;


      if (isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }

      var _props2 = this.props,
          points = _props2.points,
          label = _props2.label;

      var lineProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
      var customLabelProps = (0, _ReactUtils.getPresentationAttributes)(label);

      var labels = points.map(function (entry, i) {
        var x = entry.x + entry.width / 2;
        var y = entry.y;
        var labelProps = _extends({
          textAnchor: 'middle'
        }, entry, lineProps, customLabelProps, {
          index: i,
          key: 'label-' + i,
          payload: entry
        });

        return _this2.renderLabelItem(label, labelProps, entry.value);
      });

      return _react2.default.createElement(
        _Layer2.default,
        { className: 'recharts-line-labels' },
        labels
      );
    }
  }, {
    key: 'renderDotItem',
    value: function renderDotItem(option, props) {
      var dotItem = void 0;

      if (_react2.default.isValidElement(option)) {
        dotItem = _react2.default.cloneElement(option, props);
      } else if ((0, _isFunction3.default)(option)) {
        dotItem = option(props);
      } else {
        dotItem = _react2.default.createElement(_Dot2.default, _extends({}, props, { className: 'recharts-line-dot' }));
      }

      return dotItem;
    }
  }, {
    key: 'renderDots',
    value: function renderDots() {
      var _this3 = this;

      var isAnimationActive = this.props.isAnimationActive;


      if (isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _props3 = this.props,
          dot = _props3.dot,
          points = _props3.points;

      var lineProps = (0, _ReactUtils.getPresentationAttributes)(this.props);
      var customDotProps = (0, _ReactUtils.getPresentationAttributes)(dot);
      var dots = points.map(function (entry, i) {
        var dotProps = _extends({
          key: 'dot-' + i,
          r: 3
        }, lineProps, customDotProps, {
          cx: entry.x, cy: entry.y, index: i, payload: entry
        });

        return _this3.renderDotItem(dot, dotProps);
      });

      return _react2.default.createElement(
        _Layer2.default,
        { className: 'recharts-line-dots', key: 'dots' },
        dots
      );
    }
  }, {
    key: 'renderCurve',
    value: function renderCurve() {
      var _this4 = this;

      var _props4 = this.props,
          points = _props4.points,
          className = _props4.className,
          strokeDasharray = _props4.strokeDasharray,
          isAnimationActive = _props4.isAnimationActive,
          animationBegin = _props4.animationBegin,
          animationDuration = _props4.animationDuration,
          animationEasing = _props4.animationEasing,
          onClick = _props4.onClick,
          onMouseEnter = _props4.onMouseEnter,
          onMouseLeave = _props4.onMouseLeave,
          other = _objectWithoutProperties(_props4, ['points', 'className', 'strokeDasharray', 'isAnimationActive', 'animationBegin', 'animationDuration', 'animationEasing', 'onClick', 'onMouseEnter', 'onMouseLeave']);

      var totalLength = this.state.totalLength;

      var animationProps = {
        isActive: isAnimationActive,
        begin: animationBegin,
        canBegin: totalLength > 0,
        easing: animationEasing,
        duration: animationDuration,
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart,
        ref: 'animate',
        shouldReAnimate: true
      };
      var curveProps = _extends({}, other, { className: 'recharts-line-curve', fill: 'none',
        onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, points: points });

      if (strokeDasharray) {
        var lines = strokeDasharray.split(/[,\s]+/gim).map(function (num) {
          return parseFloat(num);
        });

        return _react2.default.createElement(
          _reactSmooth2.default,
          _extends({}, animationProps, {
            from: { length: 0 },
            to: { length: totalLength }
          }),
          function (_ref) {
            var length = _ref.length;
            return _react2.default.createElement(_Curve2.default, _extends({}, curveProps, {
              strokeDasharray: _this4.getStrokeDasharray(length, totalLength, lines)
            }));
          }
        );
      }

      return _react2.default.createElement(
        _reactSmooth2.default,
        _extends({}, animationProps, {
          from: '0px ' + (totalLength === 0 ? 1 : totalLength) + 'px',
          to: totalLength + 'px 0px',
          attributeName: 'strokeDasharray'
        }),
        _react2.default.createElement(_Curve2.default, curveProps)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          dot = _props5.dot,
          points = _props5.points,
          label = _props5.label,
          className = _props5.className;


      if (!points || !points.length) {
        return null;
      }

      var hasSinglePoint = points.length === 1;
      var layerClass = (0, _classnames2.default)('recharts-line', className);

      return _react2.default.createElement(
        _Layer2.default,
        { className: layerClass },
        !hasSinglePoint && this.renderCurve(),
        (hasSinglePoint || dot) && this.renderDots(),
        label && this.renderLabels()
      );
    }
  }]);

  return Line;
}(_react.Component), _class2.displayName = 'Line', _class2.defaultProps = {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: false,
  activeDot: true,
  dot: true,
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  fill: '#fff',
  points: [],
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
}, _temp)) || _class;

exports.default = Line;