"use client";
import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginPage = () => {
    return (
        <div className="w-full flex items-center justify-center min-h-[calc(100vh-100px)] py-10">
            <AuthForm type="sign-in" />
        </div>
    )
}

export default LoginPage