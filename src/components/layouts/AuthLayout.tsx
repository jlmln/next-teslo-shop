import Head from "next/head"
import { FC, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import { Box } from "@mui/material";

//Store
import { AppDispatch } from "@/app/store";

//Actions
import { getSummaryOrder, loadAddressFromCookies, loadCartFromCookies } from "@/app/Slices/cartSlice";

//Interfaces
import { StateCurrent } from "@/interfaces/stateCurrent";

//Actions
import { checkToken } from "@/app/Actions/Auth";
import { loginAuth } from "@/app/Slices/authSlice";

interface Props extends PropsWithChildren {
  title: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  const { data, status} = useSession()

  const dispatch = useDispatch<AppDispatch>()

  const cart = useSelector((state:StateCurrent) => state.cart)

  const allCharger = async () => {
    await dispatch(loadCartFromCookies())
    //await dispatch(checkToken())
    await dispatch(loadAddressFromCookies())
  }  

  const allCharger2 = async () => {
    await dispatch(getSummaryOrder())
  }

  useEffect(() => {
    allCharger()
  },[])

  useEffect(() => {
    allCharger2()
  },[cart])

  useEffect(() => {
    if(status == 'authenticated'){
      dispatch(loginAuth(data.user as any))
    }
  },[status, data])

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
          {children}
        </Box>
      </main>
    </>
  )
}
