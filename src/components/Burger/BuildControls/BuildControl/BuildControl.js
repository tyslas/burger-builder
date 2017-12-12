import React from 'react';

import classes from './BuildControl.css'

const buildControl = (props) => (
  <div className={classes.BuildControl}>
    <div className={classes.Label}>{props.label}</div>
    <span className={classes.Inline}>
      <button
      className={classes.Less}
      onClick={props.removed}
      disabled={props.disabled}>Less</button>
      <button
        className={classes.More} onClick={props.added}>More</button>
    </span>
  </div>
);

export default buildControl;
