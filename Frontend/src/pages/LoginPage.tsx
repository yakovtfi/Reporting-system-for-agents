import React,{useState} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = Navigate();
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage