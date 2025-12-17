import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className="relative min-h-screen flex flex-col mt-5 px-12">
           
            <main className="grow">
                {children}
            </main>
            
           
        </div>
  )
}

export default AuthLayout