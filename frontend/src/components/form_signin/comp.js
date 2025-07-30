import { useAppContext } from '../../Application';
import './style.css';

const SignInForm = () => {
    const { version, versionstate, org } = useAppContext();
    return (
        <form className='SignInForm'>
            <div className='cont btw'>
                <h5 className='nomarg'>Платформа синхронизации НСИ</h5>
                <p className='mini'>{org}</p>
            </div>
            <div className='cont'>
                <h4 className='nomarg'>Аутентификация в системе</h4>
                <div className='rowf'>
                    <label className='mini'>Учетная запись</label>
                    <input
                        placeholder='Введите имя пользователя'
                        aria-label="Поле ввода учетной записи"
                    />
                </div>
                <div className='rowf'>
                    <label className='mini'>Пароль</label>
                    <input
                        type="password"
                        placeholder='Введите пароль'
                        aria-label="Поле ввода пароля"
                    />
                </div>
                <button type="submit">
                    <i className="fa fa-sign-in" aria-hidden="true"></i>
                    <span>Войти в систему</span>
                </button>
                <p className='mini right'>Версия {version} ({versionstate})</p>
            </div>
        </form>
    );
}

export default SignInForm;