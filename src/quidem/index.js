import React, {
    useState,
    useEffect,
} from 'react';

import Layout from '../components/layout';

const Page = () => {

    // let socket = null;

    // useEffect(()=>{
    //     socket = new WebSocket();

    //     socket.onmessage = () => {};
    //     socket.onopen = () => {};
    //     socket.onclose = () => {};

    //     return function() {
    //         socket.close();
    //     };
    // });

    return (
        <Layout></Layout>
    );
};

export default Page;
