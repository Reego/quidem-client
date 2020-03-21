import React from 'react';

import Layout from '../components/layout';

const SettingsForm = () => {

    return (
        <form>

            <input type='submit'/>
        </form>
    );
};

const Page = () => {

    return (
        <Layout>
            <SettingsForm/>
        </Layout>
    );
};

export default Page;
