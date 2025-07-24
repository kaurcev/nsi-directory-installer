import { Link } from 'react-router-dom';
import './style.css';
import { useAppContext } from '../../Application';
const Header = () => {
    const { logo } = useAppContext();
    return (
        <>
            <header>
                <div className="header">
                    <Link to="/">
                        <img src={logo} className='logo' alt='Логотип' />
                        <span>Монтёр нормативно-справочной информации</span>
                    </Link>
                </div>
            </header>
        </>
    );
}

export default Header;
