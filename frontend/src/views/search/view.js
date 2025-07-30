import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { Link } from "react-router-dom";

registerLocale("ru", ru);

export default function SearchView() {
    const { setTitle, navigate } = useAppContext();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [searchType, setSearchType] = useState("name");
    const [query, setQuery] = useState("");
    const [showArchive, setShowArchive] = useState(false);
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [sorting, setSorting] = useState("");
    const [typeId, setTypeId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [descriptionQuery, setDescriptionQuery] = useState("");

    const [types, setTypes] = useState([]);
    const [groups, setGroups] = useState([]);

    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = useMemo(() => {
        return Math.ceil(allResults.length / itemsPerPage);
    }, [allResults.length]);

    const currentResults = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allResults.slice(startIndex, endIndex);
    }, [allResults, currentPage, itemsPerPage]);

    useEffect(() => {
        setTitle("Поиск");

        const fetchTypesAndGroups = async () => {
            try {
                const [typesRes, groupsRes] = await Promise.all([
                    fetch("/nsi/types"),
                    fetch("/nsi/groups")
                ]);

                const typesData = await typesRes.json();
                const groupsData = await groupsRes.json();

                if (typesData.status) setTypes(typesData.data);
                if (groupsData.status) setGroups(groupsData.data);
            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
            }
        };

        fetchTypesAndGroups();
    }, [setTitle]);

    const formatDate = (date) => {
        if (!date) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setAllResults([]);
        setCurrentPage(1);

        try {
            const params = new URLSearchParams({
                size: 1000,
                showArchive: showArchive.toString(),
            });

            if (searchType === "name" && query) {
                params.append("name", query);
            } else if (searchType === "identifier" && query) {
                params.append("identifier", query);
            }

            if (startDate) params.append("publishDateFrom", formatDate(startDate));
            if (endDate) params.append("publishDateTo", formatDate(endDate));

            if (isAdvanced) {
                if (sorting) params.append("sorting", sorting);
                if (typeId) params.append("typeId", typeId);
                if (groupId) params.append("groupId", groupId);
                if (descriptionQuery) params.append("description", descriptionQuery);
            }

            const response = await fetch(`/nsi/search?${params.toString()}`);
            const data = await response.json();

            if (!data.status) throw new Error(data.message || "Ошибка сервера");

            setAllResults(data.data || []);
            setTotalItems(data.total);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const goToPage = (page) => {

        const newPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(newPage);
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;

        if (value === "" || /^\d+$/.test(value)) {
            const pageNum = value === "" ? 1 : parseInt(value, 10);

            if (pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
            }
            else if (pageNum > totalPages) {
                setCurrentPage(totalPages);
            } else if (pageNum < 1) {
                setCurrentPage(1);
            }
        }
    };

    return (
        <>
            <Header />
            <main>
                <form className="searchbox panel clm" onSubmit={handleSubmit}>
                    <div className="row gap">
                        <div className="clm ">
                            <p className="mini">Тип поиска</p>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="name">По наименованию</option>
                                <option value="identifier">По OID</option>
                            </select>
                        </div>

                        <div className="clm">
                            <p className="mini">Ваш запрос</p>
                            <input
                                placeholder="Введите запрос"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="clm">
                            <p className="mini">Опубликован с</p>
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                locale="ru"
                                dateFormat="yyyy-MM-dd HH:mm:ss"
                                todayButton="Сегодня"
                                placeholderText="Выберите дату"
                            />
                        </div>

                        <div className="clm ">
                            <p className="mini">Опубликован до</p>
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                locale="ru"
                                dateFormat="yyyy-MM-dd HH:mm:ss"
                                todayButton="Сегодня"
                                placeholderText="Выберите дату"
                            />
                        </div>

                        <div className="end clm">
                            <button type="submit" disabled={loading}>
                                {loading ? "Загрузка..." : "Поиск"}
                            </button>
                        </div>
                    </div>

                    <div className="row gap">
                        <label className="mini row ctr">
                            <input
                                type="checkbox"
                                checked={isAdvanced}
                                onChange={() => setIsAdvanced(!isAdvanced)}
                            />
                            Расширенный поиск
                        </label>

                        <label className="mini row ctr">
                            <input
                                type="checkbox"
                                checked={showArchive}
                                onChange={() => setShowArchive(!showArchive)}
                            />
                            Показывать архивные
                        </label>
                    </div>

                    {isAdvanced && (
                        <div className="row gap">
                            <div className="clm ">
                                <p className="mini">Сортировка</p>
                                <select
                                    value={sorting}
                                    onChange={(e) => setSorting(e.target.value)}
                                >
                                    <option value="">По умолчанию</option>
                                    <option value="publishDate">По дате публикации (убыв.)</option>
                                    <option value="publishDate,asc">По дате публикации (возр.)</option>
                                    <option value="fullName">По наименованию (А-Я)</option>
                                    <option value="fullName,desc">По наименованию (Я-А)</option>
                                </select>
                            </div>

                            <div className="clm ">
                                <p className="mini">Тип</p>
                                <select
                                    value={typeId}
                                    onChange={(e) => setTypeId(e.target.value)}
                                >
                                    <option value="">Все типы</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="clm ">
                                <p className="mini">Группа</p>
                                <select
                                    value={groupId}
                                    onChange={(e) => setGroupId(e.target.value)}
                                >
                                    <option value="">Все группы</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="clm">
                                <p className="mini">Описание</p>
                                <input
                                    placeholder="Поиск по описанию"
                                    value={descriptionQuery}
                                    onChange={(e) => setDescriptionQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </form>

                <div className="clm gap">
                    {error && <div className="error">{error}</div>}

                    {loading && <div className="panel loading">Загрузка данных...</div>}

                    {!loading && totalItems > 1000 && (
                        <div className="panel info">
                            <p>Показаны первые 1000 справочников из {totalItems}. Для просмотра всех результатов уточните критерии поиска.</p>
                        </div>
                    )}

                    {!loading && currentResults.length > 0 ? (
                        <>
                            <div className="row gap btw">
                                <div className="max60 clm gap">
                                    {currentResults.map((item) => (
                                        <div className="panel searchitem clm" key={item.id}>
                                            <div className="row gap">
                                                <p className="mini nomarg">OID: <b>{item.oid}</b></p>
                                                <p className="mini nomarg">Версия: <b>{item.version}</b></p>
                                                <p className="mini nomarg">Создан: <b>{item.createDate}</b></p>
                                                <p className="mini nomarg">Опубликован: <b>{item.publishDate}</b></p>
                                                <p className="mini nomarg">Изменён: <b>{item.lastUpdate}</b></p>
                                            </div>
                                            <div className="clm">
                                                <p className="mini">Наименование</p>
                                                <p className="nomarg row ctr gap">
                                                    {item.archive ? (<><span className="archive">Справочник в архиве</span></>) : null}{item.shortName}
                                                </p>
                                            </div>
                                            <div className="clm">
                                                <p className="mini">Описание</p>
                                                <p className="nomarg max4">{item.description || "Описание не предоставлено."}</p>
                                            </div>
                                            <div className="row btw">
                                                <div className="row gap">
                                                    <button>Копировать наименование</button>
                                                    <button>Копировать OID</button>
                                                </div>
                                                <button onClick={() => navigate(`/passport/${item.oid}/${item.version}`)}>Подробнее</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="rightBar">
                                    <div className="panel">
                                        <h4 className="nomarg">Информация</h4>
                                        <p>Найдите необходимый справочник, ознакомтесь с описанием и настройте репликацию</p>
                                    </div>
                                    <div className="panel mini">
                                        <h4 className="nomarg row gapmin algctr"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i><span>ВАЖНО</span></h4>
                                        <p>Система находится в разработке, поэтому при обнаружении багов пишите в <Link to="https://github.com/kaurcev/nsi-directory-installer/issues" target="_blank">issues</Link> репозитория!</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pagination row btw">
                                <div className="panel row center gap">
                                    <button
                                        className="pagination-button"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Назад
                                    </button>

                                    <div className="row center gap">
                                        <input
                                            type="number"
                                            className="page-input"
                                            value={currentPage}
                                            onChange={handlePageInputChange}
                                            min="1"
                                            max={totalPages}
                                            disabled={totalPages <= 1}
                                        />
                                    </div>

                                    <button
                                        className="pagination-button"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Вперед
                                    </button>
                                </div>
                                <div className="outpanel">
                                    Страница {currentPage} из {totalPages}
                                </div>
                            </div>
                        </>
                    ) : (
                        !loading && allResults.length === 0 && <div className="empty">Нет результатов</div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}