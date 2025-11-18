import React from 'react'

type Props = {
  children: React.ReactNode
}

const DynamicLinkContainer = ({children}: Props) => {
  return (
    <div className="relative overflow-hidden flex-1">
      <div className="absolute top-0 bottom-0 overflow-y-auto flex flex-col w-full">
        {children}
      </div>
    </div>
  )
}
export default DynamicLinkContainer
