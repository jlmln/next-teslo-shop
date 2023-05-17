import Head from "next/head"
import { FC, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import { Box, Typography } from "@mui/material";

//Components
import { SideMenu } from "../ui";
import { AdminNavbar } from "../admin";

//Store
import { AppDispatch } from "@/app/store";

//Actions
import { getSummaryOrder, loadAddressFromCookies, loadCartFromCookies } from "@/app/Slices/cartSlice";

//Interfaces
import { StateCurrent } from "@/interfaces/stateCurrent";

//ACtions
import { loginAuth } from "@/app/Slices/authSlice";


interface Props extends PropsWithChildren {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
}

export const AdminLayout:FC<Props> = ({ children, title, subTitle, icon }) => {
  const { data, status} = useSession()

  const dispatch = useDispatch<AppDispatch>()

  const cart = useSelector((state:StateCurrent) => state.cart)

  useEffect(() => {
    dispatch(loadCartFromCookies())
    dispatch(loadAddressFromCookies())
  },[])

  useEffect(() => {
    dispatch(getSummaryOrder())
  },[cart])

  useEffect(() => {
    if(status == 'authenticated'){
      dispatch(loginAuth(data.user as any))
    }
  },[status, data])

  return (
    <>
      <nav>
        <AdminNavbar/>
      </nav>

      <SideMenu/>
      
      <main style={{
        margin: '80px auto',
        maxWidth: '1400px',
        padding: '0px 30px'
      }}>

        <Box display='flex' flexDirection='column'>
          <Typography variant="h1" component='h1'>
            {icon}
            {' '+title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }} >{subTitle}</Typography>
        </Box>

        <Box className='fadeIn' >
          {children}
        </Box>
      </main>
    </>
  )
}
