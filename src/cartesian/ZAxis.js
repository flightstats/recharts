/**
 * @fileOverview Z Axis
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import pureRender from '../util/PureRender';

@pureRender
class ZAxis extends Component {

  static displayName = 'ZAxis';

  static propTypes = {
    // The name of data displayed in the axis
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // The unit of data displayed in the axis
    unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // The unique id of z-axis
    zAxisId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // The key of data displayed in the axis
    dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // The range of axis
    range: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    zAxisId: 0,
    range: [64, 64],
  };

  render() {
    return null;
  }
}

export default ZAxis;
