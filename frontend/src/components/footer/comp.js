import { Link } from "react-router-dom";
import { useAppContext } from '../../Application';
import './style.css';

const Footer = () => {
    const { version, versionstate, org } = useAppContext();
    return (
        <footer>
            <div className="footer">
                <p>{org}, версия {version} ({versionstate})</p>
                <p className='mini'>
                    Александр Каурцев.
                    Документация по <Link to="//git.kaurcev.dev/nsi-directory-installer/">программному обеспечению</Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;