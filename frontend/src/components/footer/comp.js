import { useAppContext } from '../../Application';
import { Link } from "react-router-dom";
import './style.css';

const Footer = () => {
    const {version, versionstate, org} = useAppContext();
    return (
        <>
            <footer>
                <div className="footer">
                   <p>{org}, v{version} ({versionstate})</p>
                   <p className='mini'>Александр Каурцев. Документация по <Link to="//git.kaurcev.dev/nsi-directory-installer/">Open Source проекту</Link></p>
                </div>
            </footer>
        </>
    );
}

export default Footer;
