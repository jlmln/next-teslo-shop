import Head from "next/head"
import { FC, PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

//Components
import { Navbar, SideMenu } from "../ui";

//Store
import { AppDispatch } from "@/app/store";

//Actions
import { getSummaryOrder, loadAddressFromCookies, loadCartFromCookies } from "@/app/Slices/cartSlice";

//Interfaces
import { StateCurrent } from "@/interfaces/stateCurrent";

//ACtions
import { checkToken } from "@/app/Actions/Auth";
import { loginAuth } from "@/app/Slices/authSlice";

interface Props extends PropsWithChildren {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout:FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
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
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && (
          <meta name="org:image" content={ imageFullUrl } />
        )}
      </Head>
      
      <nav>
        <Navbar/>
      </nav>

      <SideMenu/>
      
      <main style={{
        margin: '80px auto',
        maxWidth: '1400px',
        padding: '0px 30px'
      }}>
        {children}
      </main>
      <footer>
        
      </footer>
    </>
  )
}
