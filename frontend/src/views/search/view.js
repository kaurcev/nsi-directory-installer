import React, { useEffect, useState } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";

registerLocale("ru", ru);


export default function SearchView() {
    const { setTitle } = useAppContext();
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setTitle("Поиск")
    }, [setTitle])
    return (
        <>
            <Header />
            <main>
                <form className="searchbox panel clm">
                    <div className="row gap">
                        <div className="clm ">
                            <p className="mini">Тип поиска</p>
                            <select>
                                <option>По наименованию</option>
                                <option>По OID</option>
                            </select>
                        </div>
                        <div className="clm">
                            <p className="mini">Ваш запрос</p>
                            <input placeholder="Введите запрос" />
                        </div>
                        <div className="clm">
                            <p className="mini">Опубликован с</p>
                            <DatePicker
                                selected={selectedDate}
                                onChange={setSelectedDate}
                                locale="ru"
                                dateFormat="dd.MM.yyyy"
                                todayButton="Сегодня"
                                placeholderText="Выберите дату"
                            />
                        </div>
                        <div className="clm ">
                            <p className="mini">Опубликован до</p>
                            <DatePicker
                                selected={selectedDate}
                                onChange={setSelectedDate}
                                locale="ru"
                                dateFormat="dd.MM.yyyy"
                                todayButton="Сегодня"
                                placeholderText="Выберите дату"
                            />
                        </div>
                        <div className="end clm">
                            <button>Поиск</button>
                        </div>
                    </div>
                    <div className="row gap">
                        <label className="mini row ctr">
                            <input type="checkbox" id="myCheckbox" />
                            Расширенный поиск
                        </label>
                        <label className="mini row ctr">
                            <input type="checkbox" id="myCheckbox" />
                            Архивные
                        </label>
                    </div>
                    <div className="row gap">
                        <div className="clm ">
                            <p className="mini">Сортировка</p>
                            <select>
                                <option>Типа вверх</option>
                                <option>Типа вниииз</option>
                            </select>
                        </div>
                        <div className="clm ">
                            <p className="mini">Тип</p>
                            <select>
                                <option>Типа вверх</option>
                                <option>Типа вниииз</option>
                            </select>
                        </div>
                        <div className="clm ">
                            <p className="mini">Группа</p>
                            <select>
                                <option>Типа вверх</option>
                                <option>Типа вниииз</option>
                            </select>
                        </div>
                        <div className="clm">
                            <p className="mini">Описание</p>
                            <input placeholder="Не знаю как работает поиск по описанию" />
                        </div>
                    </div>
                </form>
            </main >
            <Footer />
        </>
    )
}