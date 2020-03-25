import React from 'react';
import { useSelector } from 'react-redux';

import { Layout, Break, Card } from '../components/Layout';

const Page = () => {



    return (
        <Layout>
            <Break h='80px'/>
            <Card><h1>Uh oh, it looks like you disconnected from the session.</h1></Card>
        </Layout>
    );
};

export default Page;
