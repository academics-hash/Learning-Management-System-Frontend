"use client";
import React from 'react'
import AuthForm from '../components/AuthForm'

const RegisterPage = () => {
    return (
        <div className="w-full flex items-center justify-center min-h-[calc(100vh-100px)] py-10">
            <AuthForm type="sign-up" />
        </div>
    )
}

export default RegisterPage