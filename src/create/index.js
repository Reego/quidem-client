import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import createWebSocketConnection from '../common/socket';

import Layout, { Card, Break } from '../components/layout';

import style from './create.module.css';

const CREATE_PATH = 'http://127.0.0.1:8000/create/';

const Page = () => {

    const [redirect, setRedirect] = useState(null);

    const dispatch = useDispatch();

    const state = useSelector(state => state);

    if(state.quidem && redirect) {
        return <Redirect to={'/quidem/' + redirect}/>
    }

    return (
        <Layout>
            <Break h='50px'/>
            <Card>
                <form onSubmit={
                    (e) => {
                        e.preventDefault();

                        fetch(CREATE_PATH, {
                            method: 'POST',
                            mode: 'cors'
                        })
                        .then(responseObj => {
                            if (responseObj.status == 200) {
                                return responseObj.json();
                            }
                            else {
                                throw responseObj.json();
                            }
                        })
                        .then(response => {
                            const session_id = response.session_id;
                            createWebSocketConnection(session_id,
                                () => {
                                    setRedirect(session_id + '/');
                                },
                                dispatch
                            );
                        })
                        .catch(error => {
                            alert(error);
                            alert('Unable to create Quidem session');
                        });
                    }
                } className={style.preCreateSettingsForm}>
                    <h3>Quidem basics.</h3>
                    {/*<span>Check if users should be able to see other users' nicknames</span><input type='checkbox' name='displayNicknames'/>*/}
                    <input className={style.submitButton} type='submit' value='Create'/>
                </form>
            </Card>
        </Layout>
    );
};

export default Page;
