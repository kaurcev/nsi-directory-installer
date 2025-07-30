import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import { useParams } from "react-router-dom";

export default function PassportView() {
    const { setTitle, navigate } = useAppContext();
    const { oid, version } = useParams();
    const [hide, setHide] = useState(true); // Начальное состояние - скрыто
    const [passportLoading, setPassportLoading] = useState(false);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [versions, setVersions] = useState([]);
    const [passportData, setPassportData] = useState(null);

    // Переключение видимости структурного описания
    const toggleStructureNotes = () => {
        setHide(prev => !prev);
    };

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                setVersionsLoading(true);
                const response = await fetch(`/nsi/versions?identifier=${oid}`);
                if (!response.ok) throw new Error('Ошибка сети');
                const { data } = await response.json();
                setVersions(data);
            } catch (error) {
                console.error("Ошибка при загрузке версий:", error);
            } finally {
                setVersionsLoading(false);
            }
        };

        setTitle("Паспорт справочника");
        fetchVersions();
    }, [setTitle, oid]);

    // Загрузка данных паспорта
    useEffect(() => {
        const fetchPassport = async () => {
            if (!version) return;

            try {
                setPassportLoading(true);
                const response = await fetch(`/nsi/passport?identifier=${oid}&version=${version}`);
                if (!response.ok) throw new Error('Ошибка сети');
                const { data } = await response.json();
                setPassportData(data);
            } catch (error) {
                console.error("Ошибка при загрузке паспорта:", error);
                setPassportData(null);
            } finally {
                setPassportLoading(false);
            }
        };

        fetchPassport();
    }, [oid, version]);

    const versionsOptions = useMemo(() => {
        return versions.map((item) => (
            <option key={item.version} value={item.version}>
                Версия {item.version} от {item.publishDate || ''}
            </option>
        ));
    }, [versions]);

    const headerInfo = useMemo(() => {
        if (passportLoading || versionsLoading) {
            return <div>Загрузка...</div>;
        }
        return passportData ? (
            <>
                <h4 className="nomarg">{passportData.shortName}</h4>
                <div className="row gap">
                    <p className="mini nomarg">{passportData.oid}</p>
                    <p className="mini nomarg">{passportData.version}</p>
                    <p className="mini nomarg">Создан: <b>{passportData.createDate}</b></p>
                    <p className="mini nomarg">Опубликован: <b>{passportData.publishDate}</b></p>
                    <p className="mini nomarg">Изменён: <b>{passportData.lastUpdate}</b></p>
                </div>
            </>
        ) : (
            <p>Данные не найдены</p>
        );
    }, [passportLoading, versionsLoading, passportData]);

    const descriptionBlock = useMemo(() => {
        if (passportLoading || versionsLoading) {
            return <p>Загрузка описания...</p>;
        }
        return passportData ? (
            <pre className="nomarg">
                {passportData.description || "Описание не предоставлено"}
            </pre>
        ) : (
            <p>Нет данных для отображения</p>
        );
    }, [passportLoading, versionsLoading, passportData]);

    // Добавлен класс 'hide' в зависимости от состояния
    const structureNotesBlock = useMemo(() => {
        if (passportLoading || versionsLoading) {
            return <p>Загрузка описания...</p>;
        }
        return passportData ? (
            <>
                <pre className={`nomarg structureNotes ${hide ? "hide" : ""}`}>
                    {passportData.structureNotes || "Описание не предоставлено"}
                </pre>
                <button
                    onClick={toggleStructureNotes}
                    className="small"
                >
                    {hide ? "Показать" : "Скрыть"}
                </button>
            </>

        ) : (
            <p>Нет данных для отображения</p>
        );
    }, [passportLoading, versionsLoading, passportData, hide]); // Добавлена зависимость от hide

    const releaseNotesBlock = useMemo(() => {
        if (passportLoading || versionsLoading) {
            return <p>Загрузка описания...</p>;
        }
        return passportData ? (
            <pre className="nomarg">
                {passportData.releaseNotes || "Заметок нет"}
            </pre>
        ) : (
            <p>Нет данных для отображения</p>
        );
    }, [passportLoading, versionsLoading, passportData]);

    const handleVersionChange = (e) => {
        const newVersion = e.target.value;
        navigate(`/passport/${oid}/${newVersion}`);
    };

    return (
        <>
            <Header />
            <main>
                <div className="row btw ctr">
                    <div className="clm ctr">
                        <div className="row gap algctr">
                            <button onClick={() => navigate("/search")}>Назад</button>
                            <div className="clm">
                                {headerInfo}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel btw row gap">
                    <div className="max60 clm gap">
                        <div className="clm">
                            <p className="mini">Описание справочника</p>
                            {descriptionBlock}
                        </div>
                        <div className="clm">
                            <div className="row algctr gap">
                                <p className="mini">Структурное описание</p>
                            </div>
                            {structureNotesBlock}
                        </div>
                    </div>
                    <div className="rightBar clm gap">
                        <div className="clm">
                            <p className="mini nomarg">Версия справочника</p>
                            {versionsLoading ? (
                                <p>Загрузка версий...</p>
                            ) : (
                                <select
                                    value={version}
                                    onChange={handleVersionChange}
                                    disabled={versions.length === 0}
                                >
                                    {versionsOptions}
                                </select>
                            )}
                        </div>
                        <div className="clm">
                            <p className="mini nomarg">Заметка выпуска</p>
                            {releaseNotesBlock}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}