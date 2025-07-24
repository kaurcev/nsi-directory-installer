import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../../Application";

export default function E404View(){    
    const {setTitle} = useAppContext();
    useEffect(()=>{
        setTitle("Страница не найдена")
    }, [setTitle])
    return (
        <>
        <Header />
            <main className="centered">
                <h1 className="big">404</h1>
                <p>Данная страница удалена или не существовала вовсе.</p>
                <Link to="/">На главную</Link>
            </main>
        <Footer />
        </>
    )
}