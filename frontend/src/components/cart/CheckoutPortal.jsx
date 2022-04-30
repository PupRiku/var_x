/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CheckoutNavigation from './CheckoutNavigation';
import Details from '../settings/Details';
import Locations from '../settings/Locations';
import Shipping from './Shipping';
import Payments from '../settings/Payments';
import Confirmation from './Confirmation';

import validate from '../ui/validate';

const useStyles = makeStyles(theme => ({
  stepContainer: {
    width: '40rem',
    height: '25rem',
    backgroundColor: theme.palette.primary.main,
  },
  '@global': {
    '.MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before':
      {
        borderBottom: '2px solid #fff',
      },
    '.MuiInput-underline:after': {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
}));

export default function CheckoutPortal({ user }) {
  const classes = useStyles();
  const [selectedStep, setSelectedStep] = useState(0);
  const [detailValues, setDetailValues] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [detailSlot, setDetailSlot] = useState(0);
  const [detailBilling, setDetailBilling] = useState(false);

  const [locationValues, setLocationValues] = useState({
    street: '',
    zip: '',
    city: '',
    state: '',
  });
  const [locationSlot, setLocationSlot] = useState(0);
  const [locationBilling, setLocationBilling] = useState(false);

  const [errors, setErrors] = useState({});

  const [selectedShipping, setSelectedShipping] = useState(null);
  const shippingOptions = [
    { label: 'FREE SHIPPING', price: 0 },
    { label: '2-DAY SHIPPING', price: 9.99 },
    { label: 'OVERNIGHT SHIPPING', price: 29.99 },
  ];

  const [billingSlot, setBillingSlot] = useState(0);

  const [saveCard, setSaveCard] = useState(false);

  const errorHelper = values => {
    const valid = validate(values);

    return Object.keys(valid).some(value => !valid[value]);
  };

  const steps = [
    {
      title: 'Contact Info',
      component: (
        <Details
          user={user}
          values={detailValues}
          setValues={setDetailValues}
          slot={detailSlot}
          setSlot={setDetailSlot}
          errors={errors}
          setErrors={setErrors}
          billing={detailBilling}
          setBilling={setDetailBilling}
          checkout
        />
      ),
      error: errorHelper(detailValues),
    },
    {
      title: 'Address',
      component: (
        <Locations
          user={user}
          values={locationValues}
          setValues={setLocationValues}
          slot={locationSlot}
          setSlot={setLocationSlot}
          errors={errors}
          setErrors={setErrors}
          billing={locationBilling}
          setBilling={setLocationBilling}
          checkout
        />
      ),
      error: errorHelper(locationValues),
    },
    {
      title: 'Shipping',
      component: (
        <Shipping
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
        />
      ),
      error: selectedShipping === null,
    },
    {
      title: 'Payment',
      component: (
        <Payments
          user={user}
          slot={billingSlot}
          setSlot={setBillingSlot}
          saveCard={saveCard}
          setSaveCard={setSaveCard}
          checkout
        />
      ),
      error: false,
    },
    { title: 'Confirmation', component: <Confirmation /> },
    { title: `Thanks, ${user.username}!` },
  ];

  useEffect(() => {
    setErrors({});
  }, [detailSlot, locationSlot]);

  return (
    <Grid item container direction='column' xs={6} alignItems='flex-end'>
      <CheckoutNavigation
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />
      <Grid
        item
        container
        direction='column'
        alignItems='center'
        classes={{ root: classes.stepContainer }}
      >
        {steps[selectedStep].component}
      </Grid>
    </Grid>
  );
}
