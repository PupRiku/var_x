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
import BillingConfirmation from './BillingConfirmation';

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
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [detailSlot, setDetailSlot] = useState(0);
  const [detailForBilling, setDetailForBilling] = useState(false);

  const [locationValues, setLocationValues] = useState({
    street: '',
    zip: '',
    city: '',
    state: '',
  });
  const [billingLocation, setBillingLocation] = useState({
    street: '',
    zip: '',
    city: '',
    state: '',
  });
  const [locationSlot, setLocationSlot] = useState(0);
  const [locationForBilling, setLocationForBilling] = useState(false);

  const [errors, setErrors] = useState({});

  const [selectedShipping, setSelectedShipping] = useState(null);
  const shippingOptions = [
    { label: 'FREE SHIPPING', price: 0 },
    { label: '2-DAY SHIPPING', price: 9.99 },
    { label: 'OVERNIGHT SHIPPING', price: 29.99 },
  ];

  const [billingSlot, setBillingSlot] = useState(0);

  const [saveCard, setSaveCard] = useState(false);

  const errorHelper = (values, forBilling, billingValues, slot) => {
    const valid = validate(values);

    if (forBilling !== false && forBilling !== undefined) {
      const billingValid = validate(billingValues);

      if (forBilling === slot) {
        return Object.keys(billingValid).some(value => !billingValid[value]);
      } else {
        return (
          Object.keys(billingValid).some(value => !billingValid[value]) ||
          Object.keys(valid).some(value => !valid[value])
        );
      }
    } else {
      return Object.keys(valid).some(value => !valid[value]);
    }
  };

  let steps = [
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
          billing={detailForBilling}
          setBilling={setDetailForBilling}
          billingValues={billingDetails}
          setBillingValues={setBillingDetails}
          checkout
        />
      ),
      hasActions: true,
      error: errorHelper(
        detailValues,
        detailForBilling,
        billingDetails,
        detailSlot
      ),
    },
    {
      title: 'Billing Info',
      component: (
        <Details
          values={billingDetails}
          setValues={setBillingDetails}
          errors={errors}
          setErrors={setErrors}
          checkout
          noSlots
        />
      ),
      error: errorHelper(billingDetails),
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
          billing={locationForBilling}
          setBilling={setLocationForBilling}
          billingValues={billingLocation}
          setBillingValues={setBillingLocation}
          checkout
        />
      ),
      hasActions: true,
      error: errorHelper(
        locationValues,
        locationForBilling,
        billingLocation,
        locationSlot
      ),
    },
    {
      title: 'Billing Address',
      component: (
        <Locations
          values={billingLocation}
          setValues={setBillingLocation}
          errors={errors}
          setErrors={setErrors}
          checkout
          noSlots
        />
      ),
      error: errorHelper(billingLocation),
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
    {
      title: 'Confirmation',
      component: (
        <Confirmation
          detailValues={detailValues}
          billingDetails={billingDetails}
          detailForBilling={detailForBilling}
          locationValues={locationValues}
          billingLocation={billingLocation}
          locationForBilling={locationForBilling}
          shippingOptions={shippingOptions}
          selectedShipping={selectedShipping}
        />
      ),
    },
    { title: `Thanks, ${user.username}!` },
  ];

  if (detailForBilling !== false) {
    steps = steps.filter(step => step.title !== 'Billing Info');
  }

  if (locationForBilling !== false) {
    steps = steps.filter(step => step.title !== 'Billing Address');
  }

  useEffect(() => {
    setErrors({});
  }, [detailSlot, locationSlot, selectedStep]);

  return (
    <Grid item container direction='column' xs={6} alignItems='flex-end'>
      <CheckoutNavigation
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        details={detailValues}
        setDetails={setDetailValues}
        detailSlot={detailSlot}
        location={locationValues}
        setLocation={setLocationValues}
        locationSlot={locationSlot}
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
      {steps[selectedStep].title === 'Confirmation' && (
        <BillingConfirmation
          detailForBilling={detailForBilling}
          billingDetails={billingDetails}
          detailSlot={detailSlot}
          locationForBilling={locationForBilling}
          billingLocation={billingLocation}
          locationSlot={locationSlot}
        />
      )}
    </Grid>
  );
}
