import React, { useEffect } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";

export default function ProfileView() {
    const { setTitle, navigate } = useAppContext();
    useEffect(() => {
        setTitle("Страница профиля")
    }, [setTitle])
    return (
        <>
            <Header />
            <main>
                <div className="row btw ctr">
                    <div className="row ctr gap">
                        <button onClick={()=>navigate(-1)}>
                            Назад
                        </button>
                        <h2>Учётная запись</h2>
                    </div>
                    <div className="row gap">
                        <button>
                            Редактировать
                        </button>
                        <button className="red">
                            Выйти из учётной записи
                        </button>
                    </div>
                </div>
                <div className="panel">
                    <p className="nomarg mini">Фамилия Имя Отчество</p>
                    <p>Иванов Иван Иванович</p>
                    <p className="nomarg mini">Роль</p>
                    <p>Администратор</p>
                    <p className="nomarg mini">Описание возможностей</p>
                    <p>Управление репликацией нормативно-справочной информации</p>
                </div>
            </main>
            <Footer />
        </>
    )
}