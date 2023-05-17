import NextLink from "next/link"
import { useRouter } from "next/router"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppBar, Box, Button, Link, Toolbar, Typography, IconButton, Badge, Input, InputAdornment } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"

//Utils
import { CutPathname } from "@/utils"

//Store
import { AppDispatch } from "@/app/store"

//Actions
import { open } from "@/app/Slices/uiSlice"
import { StateCurrent } from "@/interfaces/stateCurrent"

export const Navbar = () => {

  const { pathname, push } = useRouter()

  const numItems = useSelector((state:StateCurrent) => state.cart.itemsQuantity)

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const openMenu = () => {
    dispatch(open())
  }

	const navigateTo = async (url: string) => {
		await push(url)
	}

	const onSearchTerm = async () => {
		if(searchTerm.trim().length === 0) return;
		await navigateTo(`/search/${searchTerm}`)
    setIsSearchVisible(false)
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

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn' >
          <NextLink legacyBehavior href='/category/men' passHref>
            <Link>
              <Button color={ CutPathname(pathname)  == 'men' ? 'primary' : undefined }>Hombres</Button>
            </Link>
          </NextLink>

          <NextLink legacyBehavior href='/category/women' passHref>
            <Link>
              <Button color={ CutPathname(pathname) == 'women' ? 'primary' : undefined } >Mujeres</Button>
            </Link>
          </NextLink>

          <NextLink legacyBehavior href='/category/kid' passHref>
            <Link>
              <Button color={ CutPathname(pathname) == 'kid' ? 'primary' : undefined }>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Pantallas grandes */}
        
        {isSearchVisible ?
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={ (e) => setSearchTerm(e.target.value)}
            onKeyDown={ (e) => e.key == 'Enter' ? onSearchTerm() : null }
            type='text'
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={ () => setIsSearchVisible(false)}
                >
                  <ClearOutlined/>
                </IconButton>
              </InputAdornment>
            }
          />
          :
          <IconButton className="fadeIn" onClick={() => setIsSearchVisible(true)} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <SearchOutlined/>
          </IconButton>
        }
        

        {/* Pantallas pequeñas */}
        <IconButton 
          sx={{ display: { xs: 'flex', sm: 'none' } }} 
          onClick={openMenu}
        >
          <SearchOutlined/>
        </IconButton>


        <NextLink legacyBehavior href='/cart' passHref>
          <Link>
            <IconButton> 
              <Badge badgeContent={ numItems! < 10 ? numItems : '+9' } color='secondary' >
                <ShoppingCartOutlined/>
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={openMenu}>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}
