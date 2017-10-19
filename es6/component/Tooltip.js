'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _isNumber2 = require('lodash/isNumber');

var _isNumber3 = _interopRequireDefault(_isNumber2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @fileOverview Tooltip
                                                                                                                                                                                                                                                                   */


var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PureRender = require('../util/PureRender');

var _PureRender2 = _interopRequireDefault(_PureRender);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _DefaultTooltipContent = require('./DefaultTooltipContent');

var _DefaultTooltipContent2 = _interopRequireDefault(_DefaultTooltipContent);

var _DOMUtils = require('../util/DOMUtils');

var _ReactUtils = require('../util/ReactUtils');

var _reactSmooth = require('react-smooth');

var _reactSmooth2 = _interopRequireDefault(_reactSmooth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  content: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  viewBox: _propTypes2.default.shape({
    x: _propTypes2.default.number,
    y: _propTypes2.default.number,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number
  }),

  active: _propTypes2.default.bool,
  separator: _propTypes2.default.string,
  formatter: _propTypes2.default.func,
  offset: _propTypes2.default.number,

  itemStyle: _propTypes2.default.object,
  labelStyle: _propTypes2.default.object,
  wrapperStyle: _propTypes2.default.object,
  cursor: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.element, _propTypes2.default.object]),

  coordinate: _propTypes2.default.shape({
    x: _propTypes2.default.number,
    y: _propTypes2.default.number
  }),

  label: _propTypes2.default.any,
  payload: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.any,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    unit: _propTypes2.default.any
  })),

  isAnimationActive: _propTypes2.default.bool,
  animationDuration: _propTypes2.default.number,
  animationEasing: _propTypes2.default.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  itemSorter: _propTypes2.default.func
};

var defaultProps = {
  active: false,
  offset: 10,
  viewBox: { x1: 0, x2: 0, y1: 0, y2: 0 },
  coordinate: { x: 0, y: 0 },
  cursorStyle: {},
  separator: ' : ',
  wrapperStyle: {},
  itemStyle: {},
  labelStyle: {},
  cursor: true,
  isAnimationActive: true,
  animationEasing: 'ease',
  animationDuration: 400,
  itemSorter: function itemSorter(item1, item2) {
    return -1;
  }
};

var getTooltipBBox = function getTooltipBBox(wrapperStyle, contentItem) {
  if (!(0, _ReactUtils.isSsr)()) {
    var contentHtml = _server2.default.renderToStaticMarkup(contentItem);
    var style = _extends({
      // solve the problem temporarily that the width and height will be affect by the global css
      fontSize: 12
    }, wrapperStyle, {
      top: -20000,
      left: 0,
      display: 'block'
    });

    var wrapper = document.createElement('div');

    wrapper.setAttribute('style', (0, _DOMUtils.getStyleString)(style));
    wrapper.innerHTML = contentHtml;
    document.body.appendChild(wrapper);
    var box = wrapper.getBoundingClientRect();

    document.body.removeChild(wrapper);

    return box;
  }

  return null;
};

var renderContent = function renderContent(content, props) {
  if (_react2.default.isValidElement(content)) {
    return _react2.default.cloneElement(content, props);
  } else if ((0, _isFunction3.default)(content)) {
    return content(props);
  }

  return _react2.default.createElement(_DefaultTooltipContent2.default, props);
};

var Tooltip = (_temp = _class = function (_Component) {
  _inherits(Tooltip, _Component);

  function Tooltip() {
    _classCallCheck(this, Tooltip);

    return _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).apply(this, arguments));
  }

  _createClass(Tooltip, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          payload = _props.payload,
          isAnimationActive = _props.isAnimationActive,
          animationDuration = _props.animationDuration,
          animationEasing = _props.animationEasing;


      if (!payload || !payload.length || !payload.filter(function (entry) {
        return (0, _isNumber3.default)(entry.value) || (0, _isString3.default)(entry.value);
      }).length) {
        return null;
      }

      var _props2 = this.props,
          content = _props2.content,
          viewBox = _props2.viewBox,
          coordinate = _props2.coordinate,
          active = _props2.active,
          offset = _props2.offset,
          wrapperStyle = _props2.wrapperStyle;

      var outerStyle = _extends({
        pointerEvents: 'none',
        display: active ? 'block' : 'none',
        position: 'absolute',
        top: 0
      }, wrapperStyle);
      var contentItem = renderContent(content, this.props);
      var box = getTooltipBBox(outerStyle, contentItem);

      if (!box) {
        return null;
      }
      var translateX = Math.max(coordinate.x + box.width + offset > viewBox.x + viewBox.width ? coordinate.x - box.width - offset : coordinate.x + offset, viewBox.x);

      var translateY = Math.max(coordinate.y + box.height + offset > viewBox.y + viewBox.height ? coordinate.y - box.height - offset : coordinate.y + offset, viewBox.y);

      return _react2.default.createElement(
        _reactSmooth2.default,
        {
          from: 'translate(' + translateX + 'px, ' + translateY + 'px)',
          to: 'translate(' + translateX + 'px, ' + translateY + 'px)',
          duration: animationDuration,
          isActive: isAnimationActive,
          easing: animationEasing,
          attributeName: 'transform'
        },
        _react2.default.createElement(
          'div',
          {
            className: 'recharts-tooltip-wrapper',
            style: outerStyle
          },
          contentItem
        )
      );
    }
  }]);

  return Tooltip;
}(_react.Component), _class.displayName = 'Tooltip', _class.propTypes = propTypes, _class.defaultProps = defaultProps, _temp);
exports.default = Tooltip;