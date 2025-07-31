import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { Link } from "react-router-dom";

registerLocale("ru", ru);

const ITEMS_PER_PAGE = 10;
const MAX_RESULTS = 1000;

export default function SearchView() {
    const { setTitle, navigate, addNotification } = useAppContext();
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
    const [totalItems, setTotalItems] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => (
        Math.ceil(allResults.length / ITEMS_PER_PAGE)
    ), [allResults.length]);

    const currentResults = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return allResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [allResults, currentPage]);

    const formatDate = useCallback((date) => {
        if (!date) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }, []);

    useEffect(() => {
        setTitle("Поиск");

        const fetchTypesAndGroups = async () => {
            try {
                const [typesRes, groupsRes] = await Promise.all([
                    fetch("/nsi/types"),
                    fetch("/nsi/groups")
                ]);

                const [typesData, groupsData] = await Promise.all([
                    typesRes.json(),
                    groupsRes.json()
                ]);

                if (typesData.status) setTypes(typesData.data);
                if (groupsData.status) setGroups(groupsData.data);
            } catch (err) {
                addNotification(`Ошибка загрузки данных: ${err.message}`);
            }
        };

        fetchTypesAndGroups();
    }, [setTitle, addNotification]);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        setAllResults([]);
        setCurrentPage(1);

        try {
            const params = new URLSearchParams({
                size: MAX_RESULTS,
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
            addNotification(data.message);
        } catch (err) {
            addNotification(err.message);
        } finally {
            setLoading(false);
        }
    }, [
        searchType, query, showArchive, isAdvanced, sorting,
        typeId, groupId, descriptionQuery, startDate, endDate,
        formatDate, addNotification
    ]);

    // Обработчик отправки формы
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        handleSearch();
    }, [handleSearch]);

    const goToPage = useCallback((page) => {
        const newPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(newPage);
    }, [totalPages]);

    const handlePageInputChange = useCallback((e) => {
        const value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            const pageNum = value === "" ? 1 : parseInt(value, 10);
            setCurrentPage(Math.max(1, Math.min(pageNum, totalPages)));
        }
    }, [totalPages]);
    
    const renderSkeletons = useMemo(() => (
        Array.from({ length: 3 }).map((_, idx) => (
            <div className="panel searchitem clm" key={`skeleton-${idx}`}>
                <div className="row gap">
                    <p className="loading mini nomarg">OID: <b>Загрузка</b></p>
                    <p className="loading mini nomarg">Версия: <b>Загрузка</b></p>
                    <p className="loading mini nomarg">Создан: <b>Загрузка</b></p>
                    <p className="loading mini nomarg">Опубликован: <b>Загрузка</b></p>
                    <p className="loading mini nomarg">Изменён: <b>Загрузка</b></p>
                </div>
                <div className="clm">
                    <p className="loading mini">Наименование</p>
                    <p className="loading nomarg row ctr gap">
                        Загрузка
                    </p>
                </div>
                <div className="clm">
                    <p className="loading mini">Описание</p>
                    <p className="loading nomarg max4">Загрузка</p>
                </div>
                <div className="row btw">
                    <div className="row gap">
                        <button className="loading">Копировать наименование</button>
                        <button className="loading">Копировать OID</button>
                    </div>
                    <button className="loading">Подробнее</button>
                </div>
            </div>
        ))
    ), []);

    const renderResults = useMemo(() => {
        if (loading) return renderSkeletons;
        
        if (currentResults.length > 0) {
            return currentResults.map((item) => (
                <div className="panel searchitem clm" key={`${item.oid}-${item.version}`}>
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
                            {item.archive && <span className="archive">АРХИВНЫЙ СПРАВОЧНИК</span>}
                            {item.shortName}
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
                        <button onClick={() => navigate(`/passport/${item.oid}/${item.version}`)}>
                            Подробнее
                        </button>
                    </div>
                </div>
            ));
        }
        
        return !loading && allResults.length === 0 && <div className="empty">Нет результатов</div>;
    }, [loading, currentResults, allResults.length, renderSkeletons, navigate]);

    const renderPagination = useMemo(() => {
        if (totalPages <= 1 || loading) return null;

        return (
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
        );
    }, [currentPage, totalPages, loading, goToPage, handlePageInputChange]);

    const rightPanel = useMemo(() => (
        <div className="rightBar">
            <div className="panel">
                <h4 className="nomarg">Информация</h4>
                <p>Найдите необходимый справочник, ознакомтесь с описанием и настройте репликацию</p>
            </div>
            <div className="panel mini">
                <h4 className="nomarg row gapmin algctr">
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>ВАЖНО</span>
                </h4>
                <p>Система находится в разработке, поэтому при обнаружении багов пишите в 
                    <Link to="https://github.com/kaurcev/nsi-directory-installer/issues" target="_blank"> issues</Link> репозитория!
                </p>
            </div>
        </div>
    ), []);

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

                {!loading && totalItems > MAX_RESULTS && (
                    <div className="panel info">
                        <p>Показаны первые {MAX_RESULTS} справочников из {totalItems}. Для просмотра всех результатов уточните критерии поиска.</p>
                    </div>
                )}
                
                <div className="row gap btw">
                    <div className="max60 clm gap">
                        {renderResults}
                        {renderPagination}
                    </div>
                    {rightPanel}
                </div>
            </main>
            <Footer />
        </>
    );
}