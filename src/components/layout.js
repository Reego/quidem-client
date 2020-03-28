import React from 'react';
import Helmet from 'react-helmet';

import Header from './header';

import style from './layout.module.css';

const Card = ({ children, extraClass, selectEvent }) => (
    <div onClick={selectEvent} className={
        extraClass
            ? style.card + ' ' + extraClass
            : style.card
    }>
        <div className={style.innerCard}>
            { children }
        </div>
    </div>
);

const Layout = ({ customHeader, children }) => {

    const header = customHeader || <Header/>

    return (
        <React.Fragment>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Quidem</title>
            </Helmet>
            { header }
            { children }
        </React.Fragment>
    );
};

const Break = ({ h }) => (
    <div style={{
        height:h,
        width:'100%',
    }}></div>
);

export {
    Break,
    Card
};

export default Layout;
