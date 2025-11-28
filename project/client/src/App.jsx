import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AuthProvider from './components/AuthProvider'
import Admin from './pages/Admin'
import Partner from './pages/Partner'
import SingleMovie from './pages/SingleMovie'

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
         <Route path='/admin' element={<Admin/>}></Route>
         <Route path='/partner' element={<Partner/>}></Route>
         <Route path='/singleMovie/:id' element={<SingleMovie/>}></Route>
       </Routes>
      </AuthProvider>
    </BrowserRouter>
    
    </>
  )
}

export default App