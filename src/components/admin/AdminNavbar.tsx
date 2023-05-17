import NextLink from "next/link"

import { useDispatch, useSelector } from "react-redux"

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"


//Store
import { AppDispatch } from "@/app/store"

//Actions
import { open } from "@/app/Slices/uiSlice"

export const AdminNavbar = () => {

  const dispatch = useDispatch<AppDispatch>()

  const openMenu = () => {
    dispatch(open())
  }

  return (
    <AppBar>
      <Toolbar>

        <NextLink legacyBehavior href='/' passHref>
          <Link display='flex' alignItems='center' >
            <Typography variant="h6" component='h6'>Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }} >Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={openMenu}>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}

