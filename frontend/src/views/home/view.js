import React, { useEffect } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";

export default function HomeView() {
    const { setTitle } = useAppContext();
    useEffect(() => {
        setTitle("Добро пожаловать!")
    }, [setTitle])
    return (
        <>
            <Header />
            <main>
                <div className="panel">
                    <h1>Платформа репликации нормативно-справочной информации</h1>
                    <p>Профессиональное решение для автоматической синхронизации данных НСИ
                        с локальными базами данных. Обеспечивает автономную работу
                        с актуальными справочниками без зависимости от внешних систем.</p>
                    <ul>
                        <li>Автоматическая репликация данных в корпоративные СУБД</li>
                        <li>Поддержка актуальности локальных справочников</li>
                    </ul>
                </div>
            </main>
            <Footer />
        </>
    )
}