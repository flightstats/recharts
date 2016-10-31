/**
 * @fileOverview Brush
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { scalePoint } from 'd3-scale';
import pureRender from '../util/PureRender';
import Layer from '../container/Layer';
import Text from '../component/Text';
import _ from 'lodash';

@pureRender
class Brush extends Component {

  static displayName = 'Brush';

  static propTypes = {
    className: PropTypes.string,

    fill: PropTypes.string,
    stroke: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    travellerWidth: PropTypes.number,

    dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array,
    startIndex: PropTypes.number,
    endIndex: PropTypes.number,
    tickFormatter: PropTypes.func,

    onChange: PropTypes.func,
  };

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 40,
    travellerWidth: 5,
    fill: '#fff',
    stroke: '#666',
  };

  constructor(props) {
    super(props);

    this.travellerDownHandlers = {
      startX: this.handleTravellerDown.bind(this, 'startX'),
      endX: this.handleTravellerDown.bind(this, 'endX'),
    };

    if (props.data && props.data.length) {
      this.updateScale(props);
    } else {
      this.state = {};
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data, width, x, travellerWidth, startIndex, endIndex } = this.props;

    if (nextProps.data !== data ||
      (nextProps.startIndex !== startIndex || nextProps.endIndex !== endIndex)) {
      this.updateScale(nextProps);
    } else if (nextProps.width !== width || nextProps.x !== x ||
      nextProps.travellerWidth !== travellerWidth) {
      this.scale.range([nextProps.x, nextProps.x + nextProps.width - nextProps.travellerWidth]);

      this.updateScale(nextProps);
    }
  }

  componentWillUnmount() {
    this.scale = null;

    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  }

  getIndex({ startX, endX }) {
    const min = Math.min(startX, endX);
    const max = Math.max(startX, endX);
    const minIndex = this.snapValues.indexOf(this.nearestSnapValue(min));
    const maxIndex = this.snapValues.indexOf(this.nearestSnapValue(max)) - 1;
    return {
      startIndex: minIndex,
      endIndex: maxIndex,
    };
  }

  getTextOfTick(index) {
    const { data, tickFormatter, dataKey } = this.props;
    const text = (data[index] && dataKey) ? data[index][dataKey] : index;

    return _.isFunction(tickFormatter) ? tickFormatter(text) : text;
  }

  getSvgParent = (target) => {
    if (this.svgParent) {
      return this.svgParent;
    }

    if (target.parentElement.nodeName === 'svg') {
      this.svgParent = target.parentElement;
      return target.parentElement;
    }
    return this.getSvgParent(target.parentElement);
  };

  getClickX = (e) => {
    const { target, clientX } = e;
    const svgParent = this.getSvgParent(target);
    const dim = svgParent.getBoundingClientRect();
    return clientX - dim.left;
  };

  setSnapValues = () => {
    const snapValues = [this.props.x];
    const bucketWidth = this.props.width / this.props.data.length;
    for (let i = 0; i < this.props.data.length; i++) {
      snapValues.push(snapValues[i] + bucketWidth);
    }
    const len = snapValues.length;
    this.bucketWidth = bucketWidth;
    this.snapValues = snapValues;
    this.maxValue = snapValues[len - 1];
  };

  handleMove = (e) => {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    if (this.state.isTravellerMoving) {
      this.handleTravellerMove(e);
    } else if (this.state.isSlideMoving) {
      this.handleSlideMove(e);
    }
  };

  handleUp = () => {
    this.setState({
      isTravellerMoving: false,
      isSlideMoving: false,
    });
  };

  handleLeaveWrapper = () => {
    if (this.state.isTravellerMoving || this.state.isSlideMoving) {
      this.leaveTimer = setTimeout(this.handleUp, 1000);
    }
  };

  handleEnterSlideOrTraveller = () => {
    this.setState({
      isTextActive: true,
    });
  };

  handleLeaveSlideOrTraveller = () => {
    this.setState({
      isTextActive: false,
    });
  };

  handleSlideDown = (e) => {
    this.setState({
      isTravellerMoving: false,
      isSlideMoving: true,
      slideMoveStartX: this.getClickX(e),
    });
  };

  nearestSnapValue = (pageX) => this.snapValues.reduce((prev, curr) => (Math.abs(curr - pageX) < Math.abs(prev - pageX) ? curr : prev), 0);

  handleSlideMove(e) {
    const { slideMoveStartX, startX, endX } = this.state;
    const { x, width, onChange } = this.props;
    const pageX = this.getClickX(e);
    const startNearest = this.nearestSnapValue(slideMoveStartX);
    const eventNearest = this.nearestSnapValue(pageX);

    if (startNearest !== eventNearest) {
      const diff = startNearest - eventNearest;
      const newStartX = Math.max(startX - diff, x);
      const newEndX = Math.min(endX - diff, this.maxValue);

      const newIndex = this.getIndex({
        startX: newStartX,
        endX: newEndX,
      });

      this.setState({
        startX: newStartX,
        endX: newEndX,
        slideMoveStartX: pageX,
      }, () => {
        if (onChange) {
          onChange(newIndex);
        }
      });
    }
  }

  handleTravellerDown(id, e) {
    this.setState({
      isSlideMoving: false,
      isTravellerMoving: true,
      movingTravellerId: id,
      brushMoveStartX: e.pageX,
    });
  }

  handleTravellerMove(e) {
    const { brushMoveStartX, movingTravellerId } = this.state;
    const prevValue = this.state[movingTravellerId];
    const { x, width, onChange } = this.props;
    const params = { startX: this.state.startX, endX: this.state.endX };
    const pageX = this.getClickX(e);
    const newValue = this.nearestSnapValue(pageX);
    let otherValue = this.state.startX;

    if (movingTravellerId === 'startX') {
      otherValue = this.state.endX;
    }

    if (otherValue !== newValue) {
      params[movingTravellerId] = newValue;
      const newIndex = this.getIndex(params);

      this.setState({
        [movingTravellerId]: newValue,
        brushMoveStartX: pageX,
      }, () => {
        if (onChange) {
          onChange(newIndex);
        }
      });
    }
  }

  updateScale(props) {
    const { data, startIndex, endIndex, x, width } = props;

    if (data && data.length) {
      const len = data.length + 1;
      this.scale = scalePoint().domain(_.range(0, len))
                    .range([x, x + width]);
      this.setSnapValues();
      this.state = {
        isTextActive: false,
        isSlideMoving: false,
        isTravellerMoving: false,
        startX: this.nearestSnapValue(this.scale(startIndex)),
        endX: this.nearestSnapValue(this.scale(endIndex)),
      };
    }
  }

  renderBackground() {
    const { x, y, width, height, fill, stroke } = this.props;

    return (
      <rect
        stroke={stroke}
        fill={fill}
        x={x}
        y={y}
        width={width}
        height={height}
      />
    );
  }

  renderTraveller(startX, id) {
    const { y, travellerWidth, height, stroke } = this.props;
    const lineY = Math.floor(y + height / 2) - 1;
    const x = Math.max(startX, this.props.x) - (travellerWidth / 2);

    return (
      <Layer
        className="recharts-brush-traveller"
        onMouseEnter={this.handleEnterSlideOrTraveller}
        onMouseLeave={this.handleLeaveSlideOrTraveller}
        onMouseDown={this.travellerDownHandlers[id]}
        style={{ cursor: 'col-resize' }}
      >
        <rect
          x={x}
          y={y}
          width={travellerWidth}
          height={height}
          fill={stroke}
          stroke="none"
        />
        <line
          x1={x + 1}
          y1={lineY}
          x2={x + travellerWidth - 1}
          y2={lineY}
          fill="none"
          stroke="#fff"
        />
        <line
          x1={x + 1}
          y1={lineY + 2}
          x2={x + travellerWidth - 1}
          y2={lineY + 2}
          fill="none"
          stroke="#fff"
        />
      </Layer>
    );
  }

  renderSlide(startX, endX) {
    const { y, height, stroke } = this.props;

    return (
      <rect
        className="recharts-brush-slide"
        onMouseEnter={this.handleEnterSlideOrTraveller}
        onMouseLeave={this.handleLeaveSlideOrTraveller}
        onMouseDown={this.handleSlideDown}
        style={{ cursor: 'move' }}
        stroke="none"
        fill={stroke}
        fillOpacity={0.2}
        x={Math.min(startX, endX)}
        y={y}
        width={Math.abs(endX - startX)}
        height={height}
      />
    );
  }

  renderText() {
    const { startIndex, endIndex, data, y, height, travellerWidth,
      stroke, tickFormatter } = this.props;
    const { startX, endX } = this.state;
    const offset = 5;
    const style = {
      pointerEvents: 'none',
      fill: stroke,
    };

    return (
      <Layer className="recharts-brush-texts">
        <Text
          textAnchor="end"
          verticalAnchor="middle"
          style={style}
          x={Math.min(startX, endX) - offset}
          y={y + height / 2}
        >
          {this.getTextOfTick(startIndex)}
        </Text>
        <Text
          textAnchor="start"
          verticalAnchor="middle"
          style={style}
          x={Math.max(startX, endX) + travellerWidth + offset}
          y={y + height / 2}
        >
          {this.getTextOfTick(endIndex)}
        </Text>
      </Layer>
    );
  }

  render() {
    const { x, width, data, className } = this.props;
    const { startX, endX, isTextActive, isSlideMoving, isTravellerMoving } = this.state;

    if (!data || !data.length) { return null; }

    const layerClass = classNames('recharts-brush', className);

    return (
      <Layer
        className={layerClass}
        onMouseUp={this.handleUp}
        onMouseMove={this.handleMove}
        onMouseLeave={this.handleLeaveWrapper}
      >
        {this.renderBackground()}
        {this.renderSlide(startX, endX)}
        {this.renderTraveller(startX, 'startX')}
        {this.renderTraveller(endX, 'endX')}
        {(isTextActive || isSlideMoving || isTravellerMoving) && this.renderText()}
      </Layer>
    );
  }
}

export default Brush;
