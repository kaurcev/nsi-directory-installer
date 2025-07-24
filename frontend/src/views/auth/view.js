import React, { useEffect } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import SignInForm from "../../components/form_signin/comp";

export default function SignInView() {
    const { setTitle } = useAppContext();
    useEffect(() => {
        setTitle("Авторизация")
    }, [setTitle])
    return (
        <>
            <Header />
            <main className="centered">
                <SignInForm />
            </main>
            <Footer />
        </>
    )
}