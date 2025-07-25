import { Link } from 'react-router-dom';
import './style.css';
import { useAppContext } from '../../Application';

const Header = () => {
    const { logo, navigate } = useAppContext();
    return (
        <>
            <header>
                <div className="header">
                    <div className='row ctr gap'>
                        <Link className='row ctr gap' to="/">
                            <img src={logo} className='logo' alt='Логотип системы' />
                            <span>Платформа репликации НСИ</span>
                        </Link>
                        <Link target="_blank" to="https://nsi.rosminzdrav.ru/dictionaries">Реестр справочников</Link>
                        <Link target="_blank" to="https://nsi.rosminzdrav.ru/oid">Реестр OID</Link>
                    </div>
                    <div className='row gap'>
                        <span onClick={() => navigate("/signin")}>Аутентификация</span>
                        <span onClick={() => navigate("/admin")}>Администрирование</span>
                        <span onClick={() => navigate("/profile")}>Иванов И.И.</span>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;