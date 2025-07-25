import { useAppContext } from '../../Application';
import './style.css';

const SignInForm = () => {
    const {version, versionstate, org} = useAppContext();
    return (
        <>
        <form className='SignInForm'>
            <div className='cont btw'>
                <h5 className='nomarg'>Платформа репликации НСИ</h5>
                <p className='mini'>{org}</p>
            </div>
            <div className='cont'>
                <h4 className='nomarg'>Авторизация</h4>
                <div className='rowf'>
                    <p className='mini'>Логин</p>
                    <input placeholder='Введите логин' />
                </div>
                <div className='rowf'>
                    <p className='mini'>Пароль</p>
                    <input placeholder='Введите пароль' />
                </div>
                <button>
                    <i className="fa fa-sign-in" aria-hidden="true"></i>
                    <span>Авторизироваться</span>
                </button>
                <p className='mini right'>{version} ({versionstate})</p>
            </div>
        </form>
        </>
    );
}

export default SignInForm;
