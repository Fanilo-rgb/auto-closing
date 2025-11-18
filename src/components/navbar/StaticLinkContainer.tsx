import React from 'react'
import {useLocation} from "react-router-dom";

type Props = {
  children: React.ReactNode
}

const StaticLinkContainer = ({children}: Props) => {
  const location = useLocation()

  const isMainPage = location.pathname === "/"

  return (
    <div className={`${isMainPage ? "mt-11" : "mt-2"} mb-2 pb-2 border-b border-gray-300`}>
      {children}
    </div>
  )
}
export default StaticLinkContainer
