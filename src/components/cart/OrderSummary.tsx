import {  useSelector } from 'react-redux';

import { Grid, Typography } from '@mui/material';

//Interfaces
import { StateCurrent } from '@/interfaces/stateCurrent';

//Utils
import { format } from '@/utils';

//Interfaces
import { IOrder } from '@/interfaces';
import { FC } from 'react';
interface Props{
  order?: IOrder
}

export const OrderSummary: FC<Props> = ({order}) => {

  const cartState = useSelector((state:StateCurrent) => state.cart)
  const cart = !order ? cartState : order

  return (
    <Grid container>
      <Grid item xs={6} >
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' >
        <Typography>{cart.itemsQuantity} {cart.itemsQuantity! > 1 ? 'productos' : 'producto'}</Typography>
      </Grid>

      <Grid item xs={6} >
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' >
        <Typography>{format(cart.subTotal!)}</Typography>
      </Grid>

      <Grid item xs={6} >
        <Typography>Impuestos (19%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' >
        <Typography>{format(cart.tax!)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }} >
        <Typography variant='subtitle1' >Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end' >
        <Typography>{format(cart.total!)}</Typography>
      </Grid>
    </Grid>
  )
}
