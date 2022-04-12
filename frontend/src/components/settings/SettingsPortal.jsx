/* eslint-disable */
import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSprings, animated } from 'react-spring';
import useResizeAware from 'react-resize-aware';

import { UserContext } from '../../contexts';

import accountIcon from '../../images/account.svg';
import settingsIcon from '../../images/settings.svg';
import orderHistoryIcon from '../../images/order-history.svg';
import favoritesIcon from '../../images/favorite.svg';
import subscriptionIcon from '../../images/subscription.svg';
import background from '../../images/repeating-smallest.svg';

const useStyles = makeStyles(theme => ({
  name: {
    color: theme.palette.secondary.main,
  },
  dashboard: {
    width: '100%',
    minHeight: '30rem',
    height: 'auto',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
    borderTop: `0.5rem solid ${theme.palette.primary.main}`,
    borderBottom: `0.5rem solid ${theme.palette.primary.main}`,
    margin: '5rem 0',
  },
  icon: {
    height: '12rem',
    width: '12rem',
  },
}));

const AnimatedButton = animated(Button);

export default function SettingsPortal() {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [resizeListener, sizes] = useResizeAware();

  const buttons = [
    { label: 'Settings', icon: settingsIcon },
    { label: 'Order History', icon: orderHistoryIcon },
    { label: 'Favorites', icon: favoritesIcon },
    { label: 'Subscriptions', icon: subscriptionIcon },
  ];

  const handleClick = setting => {
    if (selectedSetting === setting) {
      setSelectedSetting(null);
    } else {
      setSelectedSetting(setting);
    }
  };

  const springs = useSprings(
    buttons.length,
    buttons.map(button => ({
      to: async (next, cancel) => {
        const scale = {
          transform:
            selectedSetting === button.label || selectedSetting === null
              ? 'scale(1)'
              : 'scale(0)',
          delay: selectedSetting !== null ? 0 : 600,
        };

        const size = {
          height: selectedSetting === button.label ? '60rem' : '22rem',
          width:
            selectedSetting === button.label ? `${sizes.width}px` : '352px',
          borderRadius: selectedSetting === button.label ? 0 : 25,
          delay: selectedSetting !== null ? 600 : 0,
        };

        const hide = {
          display:
            selectedSetting === button.label || selectedSetting === null
              ? 'flex'
              : 'none',
          delay: 150,
        };

        await next(selectedSetting !== null ? scale : size);
        await next(hide);
        await next(selectedSetting !== null ? size : scale);
      },
    }))
  );

  return (
    <Grid container direction='column' alignItems='center'>
      {resizeListener}
      <Grid item>
        <img src={accountIcon} alt='settings page' />
      </Grid>
      <Grid item>
        <Typography variant='h4' classes={{ root: classes.name }}>
          Welcome back, {user.username}
        </Typography>
      </Grid>
      <Grid
        item
        container
        alignItems='center'
        justifyContent='space-around'
        classes={{ root: classes.dashboard }}
      >
        {springs.map((prop, i) => (
          <Grid item key={i}>
            <AnimatedButton
              variant='contained'
              color='primary'
              onClick={() => handleClick(buttons[i].label)}
              style={prop}
            >
              <Grid container direction='column'>
                <Grid item>
                  <img
                    src={buttons[i].icon}
                    alt={buttons[i].label}
                    className={classes.icon}
                  />
                </Grid>
                <Grid item>
                  <Typography variant='h5'>{buttons[i].label}</Typography>
                </Grid>
              </Grid>
            </AnimatedButton>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
