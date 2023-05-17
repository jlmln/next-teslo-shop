import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  current: number,
  changeQuantity: Function,
  max?: number
}

export const ItemCounter: FC<Props> = ({current,changeQuantity,max = 10}) => {
  
  const updateQuantity = (opt: 'increment' | 'decrement') => {
    if(opt == 'increment' && current < max){
      changeQuantity(current+1)
    }else if(opt == 'decrement' && current > 1){
      changeQuantity(current-1)
    }
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={() => updateQuantity('decrement')}>
        <RemoveCircleOutline/>
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center'}}>{current}</Typography>
      <IconButton onClick={() => updateQuantity('increment')}>
        <AddCircleOutline/>
      </IconButton>
    </Box>
  )
}
