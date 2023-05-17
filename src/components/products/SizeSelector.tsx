import { FC } from 'react';

//Interfaces
import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[],
  setSize: Function
}

export const SizeSelector: FC<Props> = ({selectedSize,sizes,setSize}) => {
  return (
    <Box>
      {sizes.map(size => (
        <Button 
          key={size} 
          size='small'
          color={ selectedSize === size ? 'primary' : 'info'}
          onClick={() => setSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  )
}
