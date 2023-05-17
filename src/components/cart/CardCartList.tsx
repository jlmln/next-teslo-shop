import NextLink from "next/link"
import { FC } from "react"
import { useDispatch } from 'react-redux';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"

//Components
import { ItemCounter } from "../ui"

//Interfaces
import { ICartProduct, IOrderItem } from "@/interfaces";

//Store
import { AppDispatch } from "@/app/store";

//Actions
import { changeQuantity, removeProduct } from "@/app/Slices/cartSlice";

interface Props {
  product:any,
  editable?:boolean
}

export const CardCartList: FC<Props> = ({product,editable}) => {
  const dispatch = useDispatch<AppDispatch>()

  const updateQuantity = async (value:number) => {
    dispatch(changeQuantity({...product,quantity:value}))
  }

  const removeProd = (value:string) => {
    dispatch(removeProduct(value))
  }

  return (
    <>
        <Grid container spacing={2} key={product.slug} sx={{ mb:1 }}>
          <Grid item xs={3} >
            <NextLink legacyBehavior href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component='img'
                    sx={{ borderRadius: '5px' }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7} >
            <Box display='flex' flexDirection='column' >
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">Talla: <strong>{product.size}</strong> </Typography>
              {editable 
              ? <ItemCounter current={product.quantity} max={product.inStock} changeQuantity={updateQuantity} /> 
              : <Typography variant="h4">{product.quantity}{product.quantity > 1 ? ` items` : ` item` }</Typography>}
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' alignItems='center' flexDirection='column' >
            <Typography variant='subtitle1'>{`$${product.price}`} </Typography>
            {editable && <Button variant="text" color="secondary" onClick={() => removeProd(product._id)}>
              Remover
            </Button>}
          </Grid>
        </Grid>
    </>
  )
}
