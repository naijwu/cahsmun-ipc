/* eslint-disable */

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useAuthContext } from './authentication/AuthContext';
import { API_URL } from './constants';

const Login = (props) => {

    const { currentUser, getTokenData, updateCurrentUser } = useAuthContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post(`${API_URL}/auth/login`, {
            username: username.toLowerCase(),
            password: password.toUpperCase(),
        }).then((response) => {

            updateCurrentUser(response.data);
            if(username.toLowerCase() === 'bestdais') {
                history.push('/staff');
            } else {
                history.push('/delegate');
            }
        }).catch((error) => {
            if(error.response) {
                setError(`${error.response.data.message}`);
            }
            setLoading(false);
        });

        setLoading(false);
    }

    return (!currentUser) ? (
        <div className='login'>
            <div className='pop'>
                <div className='pop-inner'>
                    <h2>Login to IPC</h2>
                    <div className='input-label'>
                        Username
                    </div>
                    <input type='text' value={username} onChange={e=>setUsername(e.target.value)} />
                    <div className='input-label'>
                        Password
                    </div>
                    <input type='password' value={password} onChange={e=>setPassword(e.target.value)} />
                    <input disabled={loading} type='submit' value='Enter' onClick={e=>handleLogin(e)} />
                    {(error) ? (
                        <div className='error'>
                            {error}
                        </div>
                    ) : ''}
                </div>
                <div className='pop-still-inner'> {/* Why is my naming so ass? */}
                    <Link to='/'>Back Home</Link>
                    <a href="mailto:it@cahsmun.org">Report an Issue</a>
                </div>
            </div>
        </div>
    ) : (
        <div className='already'>
            You're already logged in &mdash;&nbsp;<Link to='/'>Back home</Link>.
        </div>
    );
}

export default Login;