import React from 'react';

import style from './header.module.css';

const Header = ({ children }) => (
    <div className={style.header}>Okay
        {children}
    </div>
);

export default Header;
