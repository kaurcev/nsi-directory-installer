import React, { useEffect } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";

export default function ProfileView() {
    const { setTitle, navigate } = useAppContext();
    useEffect(() => {
        setTitle("Профиль пользователя")
    }, [setTitle])
    return (
        <>
            <Header />
            <main>
                <div className="row btw ctr">
                    <div className="row ctr gap">
                        <button onClick={() => navigate(-1)}>
                            <i className="fa fa-chevron-left" aria-hidden="true"></i> <span>Назад</span>
                        </button>
                        <h2>Профиль пользователя</h2>
                    </div>
                    <div className="row gap">
                        <button>
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                            <span>Редактировать профиль</span>
                        </button>
                        <button className="red">
                            <i className="fa fa-sign-out" aria-hidden="true"></i> <span>Завершение сеанса</span>
                        </button>
                    </div>
                </div>
                <div className="panel">
                    <p className="nomarg mini">ФИО</p>
                    <p>Иванов Иван Иванович</p>
                    <p className="nomarg mini">Должность</p>
                    <p>Администратор системы</p>
                    <p className="nomarg mini">Функциональные полномочия</p>
                    <p>Управление процессами репликации нормативно-справочной информации</p>
                </div>
            </main>
            <Footer />
        </>
    )
}
