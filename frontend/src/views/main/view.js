import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";

export default function MainView() {
    const { setTitle } = useAppContext();
    useEffect(() => {
        setTitle("Главный экран")
    }, [setTitle])
    return (
        <>
            <Header />
            <main>
                <div className="row btw ctr">
                    <div className="row ctr gap">
                        <h1>Панель управления платформой репликации НСИ</h1>
                    </div>
                    <div className="row gap">
                        <button>
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                            <span>Обновить данные</span>
                        </button>
                    </div>
                </div>
                <h2>Управление</h2>
                <div className="grid">
                    <div className="panel clm gap">
                        <h3 className="nomarg">Федеральный реестр НСИ</h3>
                        <p className="mini">Поиск и верификация справочников в едином реестре по наименованию, OID или реквизитам</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Перейти в реестр</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Локальные копии справочников</h3>
                        <p className="mini">Управление версиями справочников, загруженных в систему для оперативного использования</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Перейти к хранилищу</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Архив версий</h3>
                        <p className="mini">История изменений справочников и контроль версий нормативной базы</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Открыть архив</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Интеграционные настройки</h3>
                        <p className="mini">Конфигурация параметров интеграции с <Link to="https://nsi.rosminzdrav.ru/profile">Федеральным порталом НСИ</Link></p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Настроить подключение</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Планировщик обновлений</h3>
                        <p className="mini">Конфигурация автоматизированных процедур проверки актуальности справочников</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Настроить расписание</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Система оповещений</h3>
                        <p className="mini">Настройка каналов получения уведомлений об изменениях в НСИ</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Управление уведомлениями</span></button>
                        </div>
                    </div>
                    <div className="panel clm gap">
                        <h3 className="nomarg">Журнал системных событий</h3>
                        <p className="mini">Мониторинг и анализ записей о функционировании системы</p>
                        <div className="rightf">
                            <button><i className="fa fa-sign-in" aria-hidden="true"></i> <span>Перейти к журналу</span></button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}