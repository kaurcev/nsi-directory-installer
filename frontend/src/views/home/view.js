import React, { useEffect } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";

export default function HomeView(){   
    const {setTitle} = useAppContext();
    useEffect(()=>{
        setTitle("Добро пожаловать!")
    }, [setTitle]) 
    return (
        <>
        <Header />
            <main>
                okak
            </main>
        <Footer />
        </>
    )
}