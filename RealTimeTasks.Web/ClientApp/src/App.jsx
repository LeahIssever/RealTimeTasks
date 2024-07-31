import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Pages/Home';
import { AuthContextComponent } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Logout from './Pages/Logout';

const App = () => {
    return (
        <AuthContextComponent>
            <Layout>
                <Routes>
                    <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/logout' element={<PrivateRoute><Logout /></PrivateRoute>} />
                </Routes>
            </Layout>
        </AuthContextComponent>
    );
}

export default App;