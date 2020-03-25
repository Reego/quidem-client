import React from 'react';

import Layout, { Card, Break } from '../components/layout';

import style from './create.module.css';

const CREATE_PATH = 'create/';

const SettingsForm = () => {

    const formHandler = (e) => {
        e.preventDefault();

        const elements = e.target.elements;

        const displayNicknames = elements['displayNicknames'].checked;

        fetch(CREATE_PATH)
            .then(responseObj => {
                if (responseObj.status < 200 || responseObj.status >= 300) {
                // Get response as text
                    alert(responseObj);
                }
            })
            .catch(error => {
                alert('Unable to create Quidem session');
            });

        // POST request
    };

    return (
        <form onSubmit={formHandler} className={style.preCreateSettingsForm}>
            <h3>Quidem basics.</h3>
            {/*<span>Check if users should be able to see other users' nicknames</span><input type='checkbox' name='displayNicknames'/>*/}
            <input className={style.submitButton} type='submit' value='Create'/>
        </form>
    );
};

const Page = () => {

    return (
        <Layout>
            <Break h='50px'/>
            <Card>
                <SettingsForm/>
            </Card>
        </Layout>
    );
};

export default Page;
