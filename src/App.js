import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home/home';
import Register from './pages/Login&Register/register';
import Login from './pages/Login&Register/login';
import { useContext } from 'react';
import { Authcontext } from './contextProvider';
import { Navigate } from 'react-router-dom';

function App() {

  const {currentUser} = useContext(Authcontext)
  return (
    <BrowserRouter>
      <Routes basename='/kanban_board'>
        <Route element={<Home/>} path='/home'></Route>
        <Route path="/Register" element={<Register/>}></Route>
        <Route  path="/Login" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
