import React from 'react';

import Aux from '../../hoc/Aux';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import classes from './Layout.css';

const layout = (props) => (
  <Aux>
    <Toolbar />
    {/* <div>Toolbar, SideDrawer, Backdrop</div> */}
    <main className={classes.Content}>
      {props.children}
    </main>
  </Aux>
)

export default layout;
