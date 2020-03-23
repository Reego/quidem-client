import React from 'react';

import Layout, { Card, Break } from '../components/layout';

import style from './create.module.css';

const SettingsForm = () => {

    const formHandler = (e) => {
        e.preventDefault();

        const elements = e.target.elements;

        const displayNicknames = elements['displayNicknames'].checked;

        // POST request
    };

    return (
        <form onSubmit={formHandler} className={style.preCreateSettingsForm}>
            <h3>Before creating the Quidem session, decide on the following:</h3>
            <span>Check if users should be able to see other users' nicknames</span><input type='checkbox' name='displayNicknames'/>
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
