import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem
      link="/"
      active={true}>BurgerBuilder</NavigationItem>
    <NavigationItem
      link="/"
      active={false}>Checkout</NavigationItem>
  </ul>
);


export default navigationItems;
