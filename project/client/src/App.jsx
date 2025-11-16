import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AuthProvider from './components/AuthProvider'

function App() {

  return (
    <>
    <BrowserRouter>
    <AuthProvider>
       <Routes>
         {/* <Route path='/home' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/> */}
         
         <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
         <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
         <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
       </Routes>
      </AuthProvider>
    </BrowserRouter>
    
    </>
  )
}

export default App