/* eslint-disable */
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import sort from '../../images/sort.svg';
import close from '../../images/close-outline.svg';

const useStyles = makeStyles((theme) => ({
  chipContainer: {
    [theme.breakpoints.down('md')]: {
      margin: '0.5rem',
    },
  },
}));

export default function Sort({ setOption }) {
  const classes = useStyles();
  const matchesXS = useMediaQuery((theme) => theme.breakpoints.down('xs'));

  const sortOptions = [
    { label: 'A-Z' },
    { label: 'Z-A' },
    { label: 'NEWEST' },
    { label: 'OLDEST' },
    { label: 'PRICE ↑' },
    { label: 'PRICE ↓' },
    { label: 'REVIEWS' },
  ];

  return (
    <Grid item container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={sort} alt='sort' />
        </IconButton>
      </Grid>
      <Grid item xs>
        <Grid
          container
          justifyContent='space-around'
          alignItems={matchesXS ? 'center' : undefined}
          direction={matchesXS ? 'column' : 'row'}
        >
          {sortOptions.map((option) => (
            <Grid
              item
              key={option.label}
              classes={{ root: classes.chipContainer }}
            >
              <Chip label={option.label} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setOption(null)}>
          <img src={close} alt='close' />
        </IconButton>
      </Grid>
    </Grid>
  );
}
