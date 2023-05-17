import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "next-auth/react"

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"

//Interfaces
import { StateCurrent } from "@/interfaces/stateCurrent"

//Store
import { AppDispatch } from "@/app/store"
import { close } from "@/app/Slices/uiSlice"
import { useState } from "react"
import { logout } from "@/app/Slices/authSlice"

//Actions

export const SideMenu = () => {
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const [searchTerm, setSearchTerm] = useState('')

	const openM = useSelector((state:StateCurrent) => state.ui)
	const auth = useSelector((state:StateCurrent) => state.auth)

	const navigateTo = async (url: string) => {
		await router.push(url)
		dispatch(close())
	}

	const onSearchTerm = () => {
		if(searchTerm.trim().length === 0) return;
		navigateTo(`/search/${searchTerm}`)
	}

	const onLogoout = () => {
		 dispatch(logout())
		 signOut()
	}

	const closeMenu = () => {
		dispatch(close())
	}

	return (
	<Drawer
		open={openM.sidemenuOpen}
		anchor='right'
		sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
		onClose={closeMenu}
	>
		<Box>
			<List>
				<ListItem>
					<Input
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
									onClick={onSearchTerm}
								>
									<SearchOutlined/>
								</IconButton>
							</InputAdornment>
						}
					/>
				</ListItem>

				{auth && auth.isLoggedIn && <ListItemButton>
					<ListItemIcon>
							<AccountCircleOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Perfil'} />
				</ListItemButton>}

				{auth && auth.isLoggedIn && <ListItemButton>
					<ListItemIcon>
							<ConfirmationNumberOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Mis Ordenes'} onClick={() => navigateTo('/orders/history')} />
				</ListItemButton>}

				<ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
					<ListItemIcon>
							<MaleOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Hombres'} />
				</ListItemButton>

				<ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
					<ListItemIcon>
							<FemaleOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Mujeres'} />
				</ListItemButton>

				<ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kid')}>
					<ListItemIcon>
							<EscalatorWarningOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Niños'} />
				</ListItemButton>


				{auth && !auth.isLoggedIn ? 
				<ListItemButton onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}>
					<ListItemIcon>
							<VpnKeyOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Ingresar'} />
				</ListItemButton>
				:
				<ListItemButton onClick={() => onLogoout()}>
					<ListItemIcon>
							<LoginOutlined/>
					</ListItemIcon>
					<ListItemText primary={'Salir'} />
				</ListItemButton>}


				{/* Admin */}
				{auth && auth.user?.role === 'admin' && 
				<>
					<Divider />
					<ListSubheader>Admin Panel</ListSubheader>

					<ListItemButton
						onClick={() => navigateTo('/admin/')}
					>
						<ListItemIcon>
								<DashboardOutlined/>
						</ListItemIcon>
						<ListItemText primary={'Dashboard'} />
					</ListItemButton>

					<ListItemButton
						onClick={() => navigateTo('/admin/products')}
					>
						<ListItemIcon>
								<CategoryOutlined/>
						</ListItemIcon>
						<ListItemText primary={'Productos'} />
					</ListItemButton>
					
					<ListItemButton
						onClick={() => navigateTo('/admin/orders')}
					>
						<ListItemIcon>
								<ConfirmationNumberOutlined />
						</ListItemIcon>
						<ListItemText primary={'Ordenes'} />
					</ListItemButton>

					<ListItemButton
						onClick={() => navigateTo('/admin/users')}
					>
						<ListItemIcon>
								<AdminPanelSettings/>
						</ListItemIcon>
						<ListItemText primary={'Usuarios'} />
					</ListItemButton>
				</>
				}
			</List>
		</Box>
	</Drawer>
	)
}
