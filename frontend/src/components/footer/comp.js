import { useAppContext } from '../../Application';
import './style.css';

const Footer = () => {
    const {version, versionstate, name} = useAppContext();
    return (
        <>
            <footer>
                <div className="footer">
                   {name}, v{version} ({versionstate})
                </div>
            </footer>
        </>
    );
}

export default Footer;
