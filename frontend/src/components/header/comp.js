import { Link } from 'react-router-dom';
import './style.css';
import { useAppContext } from '../../Application';
const Header = () => {
    const {name} = useAppContext();
    return (
        <>
            <header>
                <div className="header">
                    <div className="logo">
                        <Link to="/">{name}</Link>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
