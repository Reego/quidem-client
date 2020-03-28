import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import createWebSocketConnection from '../common/socket';

import Layout from '../components/layout';

import style from './home.module.css';

const ProcessJoin = () => {
    return null;
};

const Page = () => {

    const [sessionIdError, setSessionIdError] = useState(null);
    const [nicknameError, setNicknameError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const state = useSelector(state => state);

    const dispatch = useDispatch();

    const formHandler = (e) => {
        e.preventDefault();

        const elements = e.target.elements;

        const session_id = elements['session_id'].value;
        const nickname = elements['nickname'].value;

        let isValidJoinForm = true;

        if(nickname === 'Author') {
            isValidJoinForm = false;
            setNicknameError("Nickname cannot be \"Author\"");
            setSessionIdError(null);
        }

        if(isValidJoinForm) { // request join session, create WebSocket connection
            createWebSocketConnection(session_id,
                () => {
                    setRedirect(session_id + '/');
                },
            dispatch,
            nickname
            );
        }
    };

    if(state.quidem && redirect) {
        return <Redirect to={'/quidem/' + redirect}/>
    }

    return (
        <Layout>
            <div className={style.homeCard}>
                <h2>Join or Create</h2>
                <div className={style.join}>
                    <form onSubmit={formHandler}>
                        <input name='session_id' type='text' placeholder='Quidem Code' required/>
                        {sessionIdError != null &&
                            <p>{sessionIdError}</p>
                        }
                        <input name='nickname' type='text' placeholder='Nickname' required/>
                        {nicknameError != null &&
                            <p>{nicknameError}</p>
                        }
                        <input className={style.button} name='submit' type='submit' value='Join'/>
                    </form>
                </div>
                <div className={style.create}>
                    <Link to='/create'>Create Quidem Session<div></div></Link>
                </div>
            </div>
        </Layout>
    );
};

export default Page;
