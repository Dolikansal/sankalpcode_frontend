import {Routes , Route, Navigate} from 'react-router';
import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import { checkauth } from './authslice';
import {useDispatch , useSelector} from 'react-redux'; 
import { useEffect } from 'react';
import Admin from './pages/admin';
import Problempage from './pages/problmepage';
import AdminPanel from "./components/createadmin";
import SubmissionHistory from "./components/updateadmin";
import AdminDelete from "./components/deleteadmin";
import InstructorPage from './pages/instr';
import ProfilePage from './pages/profile';
import AdminVideo from './components/videoadmin';
import Adminuplaod from './components/uploadadmin';

function App(){

  const {isauth , loading} = useSelector((state) => state.auth);
  const {user : newuser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkauth());
  } , [dispatch])

  if(loading){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    )
  }
  const isAdmin = isauth && newuser?.role === "admin";
  return (
    <>
      <Routes>
        <Route path='/' element={isauth? <Home></Home> : <Navigate to="/signup"></Navigate>} />
        <Route path='/login' element={isauth ? <Navigate to = "/"></Navigate> : <Login></Login>} />
        <Route path='/signup' element={isauth? <Navigate to = "/"></Navigate> : <Signup></Signup>} />
        <Route path="/instructor" element={isauth ? <InstructorPage /> : <Navigate to="/signup" />} />
        
        <Route path="/admin" element={isAdmin ? <Admin></Admin> : <Navigate to="/"></Navigate>}></Route>
        <Route path="/admin/create" element={isAdmin ? <AdminPanel /> : <Navigate to="/"></Navigate>} />
        <Route path="/admin/update/:problemid?" element={isAdmin ? <SubmissionHistory /> : <Navigate to="/"></Navigate>}/>
        <Route path="/admin/delete" element={isAdmin ? <AdminDelete /> : <Navigate to="/"></Navigate>}/>
        <Route path="/admin/video" element={isAdmin ? <AdminVideo /> : <Navigate to="/"></Navigate>}/>
        <Route path="/admin/upload/:problemid" element={isAdmin ? <Adminuplaod /> : <Navigate to="/"></Navigate>}/>
        <Route path='/problem/:problemId' element={<Problempage></Problempage>}></Route>
        <Route path='/profile' element={isauth ? <ProfilePage /> : <Navigate to="/signup" />} />
      </Routes>
    </>
  );
}
export default App;