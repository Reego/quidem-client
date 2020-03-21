import React from 'react';

import Layout from '../components/layout';

const JoinForm = () => {

    return (
        <form>
            <input name='session_id' type='text' required/>
            <input name='nickname' type='text' required/>
            <input name='submit' type='submit'/>
        </form>
    );
};

const ProcessJoin = () => {
    return null;
};

const Page = () => {

    return (
        <Layout>
            <JoinForm/>
            <a><div>Create</div></a>
        </Layout>
    );
};

export default Page;
