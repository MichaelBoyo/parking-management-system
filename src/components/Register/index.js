import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss';
import { loginPageImage } from '../../assets';

import useInput from '../../utils/hooks/useInput';
import isPassword from '../../utils/functions/isPassword';
import isEmail from '../../utils/functions/isEmail';
import { Input, PassWordInput } from '..';

function Login() {
  const [email, setEmail, clearEmail] = useInput('');
  const [fullname, setFullName, clearFullName] = useInput('');
  const [password, setPassword, clearPassword] = useInput('');
  const [password2, setPassword2, clearPassword2] = useInput('');
  const [emailError, setEmailError] = useState(false);
  const [passWordError, setPassWordError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(String(email)) || !isPassword(String(password))) {
      if (!isEmail(String(email))) {
        setEmailError(true);
        setTimeout(() => {
          setEmailError(false);
        }, 3000);
      }
      if (!isPassword(String(password))) {
        setPassWordError(true);
        setTimeout(() => {
          setPassWordError(false);
        }, 3000);
      }
      return;
    }
    navigate('/dashboard');
  };
  return (
    <section className={style.LogIn}>
      <div className={style.LogIn__left}>
        {/* <Logo className={style.LogIn__left__logo}/> */}
        <img
          src={loginPageImage}
          className={style.LogIn__left__illustration}
          alt="SignIn illustration"
          role="presentation"
        />
      </div>
      <div className={style.LogIn__right}>
        <h2 className={style.LogIn__right__heading}>Register to Continue!</h2>
        <p className={style.LogIn__right__details}>Enter details to Register</p>
        <form onSubmit={handleSubmit} className={style.LogIn__right__form}>
          <Input
            {...{
              value: String(fullname),
              setValue: setFullName,
              clearValue: clearFullName,
              placeholder: 'Full name',
              type: 'text',
            }}
          />
          <Input
            {...{
              value: String(email),
              setValue: setEmail,
              clearValue: clearEmail,
              placeholder: 'Email',
              type: 'text',
              error: emailError,
              errorMessage: 'Please enter a valid email',
            }}
          />
          <PassWordInput
            {...{
              value: String(password),
              setValue: setPassword,
              clearValue: clearPassword,
              placeholder: 'Password',
              type: 'password',
              error: passWordError,
              errorMessage:
                'Please enter a password with an Uppercase, Lowercase, Number and a special character',
            }}
          />
          <PassWordInput
            {...{
              value: String(password2),
              setValue: setPassword2,
              clearValue: clearPassword2,
              placeholder: 'Confirm Password',
              type: 'password2',
              error: passWordError,
              errorMessage:
                'Please enter a password with an Uppercase, Lowercase, Number and a special character',
            }}
          />
          <span
            onClick={() => navigate('/login')}
            className={style.LogIn__right__form__forgot}
          >
            HAVE AN ACCOUNT? LOGIN
          </span>

          <button className={style.LogIn__right__form__button} type="submit">
            <h3 className={style.h3}>REGISTER</h3>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
