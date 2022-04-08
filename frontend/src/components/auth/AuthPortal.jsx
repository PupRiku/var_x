/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import Login from './Login';
import SignUp from './SignUp';
import Complete from './Complete';
import Reset from './Reset';
import { UserContext, FeedbackContext } from '../../contexts';
import { setUser, setSnackbar } from '../../contexts/actions';

const useStyles = makeStyles(theme => ({
  paper: {
    border: `2rem solid ${theme.palette.secondary.main}`,
    width: '50rem',
    height: '40rem',
    borderRadius: 0,
  },
  inner: {
    height: '40rem',
    width: '100%',
    border: `2rem solid ${theme.palette.primary.main}`,
  },
  container: {
    marginBottom: '8rem',
  },
  '@global': {
    '.MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
      {
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
      },
    '.MuiInput-underline:after': {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
}));

export default function AuthPortal() {
  const classes = useStyles();
  const [selectedStep, setSelectedStep] = useState(0);
  const { user, dispatchUser } = useContext(UserContext);
  const { feedback, dispatchFeedback } = useContext(FeedbackContext);

  const steps = [
    { component: Login, label: 'Login' },
    { component: SignUp, label: 'Sign Up' },
    { component: Complete, label: 'Complete' },
    { component: Reset, label: 'Reset' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const access_token = params.get('access_token');

    if (code) {
      const resetStep = steps.find(step => step.label === 'Reset');
      setSelectedStep(steps.indexOf(resetStep));
    } else if (access_token) {
      axios
        .get(process.env.GATSBY_STRAPI_URL + '/auth/facebook/callback', {
          params: { access_token },
        })
        .then(res => {
          dispatchUser(
            setUser({ ...res.data.user, jwt: res.data.jwt, onboarding: true })
          );
          window.history.replaceState(null, null, window.location.pathname);
        })
        .catch(err => {
          dispatchFeedback(
            setSnackbar({
              status: 'error',
              message: 'Connecting To Facebook failed, pelase try again.',
            })
          );
        });
    }
  }, []);

  return (
    <Grid
      container
      justifyContent='center'
      classes={{ root: classes.container }}
    >
      <Grid item>
        <Paper elevation={6} classes={{ root: classes.paper }}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='space-between'
            classes={{ root: classes.inner }}
          >
            {steps.map((Step, i) =>
              selectedStep === i ? (
                <Step.component
                  setSelectedStep={setSelectedStep}
                  steps={steps}
                  user={user}
                  dispatchUser={dispatchUser}
                  feedback={feedback}
                  dispatchFeedback={dispatchFeedback}
                  key={Step.label}
                />
              ) : null
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
