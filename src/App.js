import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home/home';
import Register from './pages/Login&Register/register';
import Login from './pages/Login&Register/login';

function App() {
  return (
    // <div className="App">

    // </div>
    <BrowserRouter>
      <Routes>
        <Route element={<Home/>} path='/home'></Route>
        <Route exact path="/Register" element={<Register/>}></Route>
        <Route  path="/Login" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
