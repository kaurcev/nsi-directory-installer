import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "../../components/header/comp";
import Footer from "../../components/footer/comp";
import { useAppContext } from "../../Application";
import { useParams } from "react-router-dom";

const SkeletonText = ({ lines = 1 }) => (
    <div className="clm gap">
        {Array.from({ length: lines }).map((_, i) => (
            <p key={i} className="loading nomarg">Загрузка...</p>
        ))}
    </div>
);

const StructureNotes = ({ loading, data, hidden, onToggle }) => {
    if (loading) {
        return (
            <div className="clm gap">
                <SkeletonText lines={3} />
                <button className="small loading">Загрузка</button>
            </div>
        );
    }

    if (!data) return <p>Нет данных для отображения</p>;

    return (
        <>
            <pre className={`nomarg structureNotes ${hidden ? "hide" : ""}`}>
                {data.structureNotes || "Описание не предоставлено"}
            </pre>
            <button onClick={onToggle} className="small">
                {hidden ? "Показать" : "Скрыть"}
            </button>
        </>
    );
};

export default function PassportView() {
    const { setTitle, navigate, addNotification } = useAppContext();
    const { oid, version } = useParams();
    const [hide, setHide] = useState(true);
    const [passportLoading, setPassportLoading] = useState(false);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [versions, setVersions] = useState([]);
    const [passportData, setPassportData] = useState(null);

    const toggleStructureNotes = useCallback(() => {
        setHide(prev => !prev);
    }, []);

    useEffect(() => {
        setTitle("Паспорт справочника");

        const fetchVersions = async () => {
            try {
                setVersionsLoading(true);
                const response = await fetch(`/nsi/versions?identifier=${oid}`);
                if (!response.ok) throw new Error('Ошибка сети');
                const { data } = await response.json();
                addNotification(data.message);
                setVersions(data);
            } catch (error) {
                addNotification(error.message)
            } finally {
                setVersionsLoading(false);
            }
        };

        fetchVersions();
        // eslint-disable-next-line
    }, [setTitle, oid]);

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
                addNotification(error.message)
                setPassportData(null);
            } finally {
                setPassportLoading(false);
            }
        };

        fetchPassport();
        // eslint-disable-next-line
    }, [oid, version]);

    const handleVersionChange = useCallback((e) => {
        const newVersion = e.target.value;
        navigate(`/passport/${oid}/${newVersion}`);
    }, [navigate, oid]);

    const versionsOptions = useMemo(() => (
        versions.map((item) => (
            <option key={item.version} value={item.version}>
                Версия {item.version} от {item.publishDate || ''}
            </option>
        ))
    ), [versions]);

    const headerInfo = useMemo(() => {
        if (passportLoading) {
            return (
                <div className="clm">
                    <h4 className="nomarg loading">Загрузка...</h4>
                    <div className="row gap">
                        {Array(5).fill().map((_, i) => (
                            <p key={i} className="mini nomarg loading">Загрузка...</p>
                        ))}
                    </div>
                </div>
            );
        }

        if (!passportData) return <p>Данные не найдены</p>;

        return (
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
        );
    }, [passportLoading, passportData]);

    const descriptionBlock = useMemo(() => {
        if (passportLoading) {
            return <SkeletonText lines={3} />;
        }

        if (!passportData) return <p>Нет данных для отображения</p>;

        return (
            <pre className="nomarg">
                {passportData.description || "Описание не предоставлено"}
            </pre>
        );
    }, [passportLoading, passportData]);

    const releaseNotesBlock = useMemo(() => {
        if (passportLoading) {
            return <SkeletonText lines={1} />;
        }

        if (!passportData) return <p>Нет данных для отображения</p>;

        return (
            <pre className="nomarg">
                {passportData.releaseNotes || "Заметок нет"}
            </pre>
        );
    }, [passportLoading, passportData]);

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
                            <StructureNotes
                                loading={passportLoading}
                                data={passportData}
                                hidden={hide}
                                onToggle={toggleStructureNotes}
                            />
                        </div>
                    </div>
                    <div className="rightBar clm gap">
                        <div className="clm">
                            <p className="mini nomarg">Версия справочника</p>
                            {versionsLoading ? (
                                <SkeletonText lines={1} />
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