
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
     const {userData} = useSelector(state =>state.user)
     
    // console.log(useSelector(state=>state),userData,"Public route");

     if(userData){
        return <Navigate to='/home'/>
     }
     return children
}

export default PublicRoute