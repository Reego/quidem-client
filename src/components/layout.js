import React from 'react';

import Header from './header';

const Layout = ({ children }) => (
    <React.Fragment>
        <Header/>
        {children}
    </React.Fragment>
);

export default Layout;
