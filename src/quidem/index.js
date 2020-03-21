import React, {
    useState,
    useEffect,
} from 'react';

import Layout, { Card, Break } from '../components/layout';

import style from './quidem.module.css';

const TitledCard = ({ children, title, extraClass }) => (
    <Card extraClass={extraClass}>
        <h1>{title}</h1>
    </Card>
);

const Nomination = ({ content, nickname }) => (

    <Card extraClass={style.nomination}>
        <div className={style.nominationVotingSection}>
            <span>VOTE</span>
            <span className={style.voteNumber}>3</span>
        </div>
        <div className={style.nominationContent}>
            { content }
            <h3>{ nickname }</h3>
        </div>
    </Card>
);

const NicknameDisplay = ({ nickname }) => <div className={style.nicknameDisplay}><span>{ nickname }</span></div>

const AuthorPanel = () => {
    return (
        <React.Fragment>
            {/* User nickname display */}
            <Card extraClass={style.card}>
                <NicknameDisplay nickname='Pete Buttigiege'/>
                <NicknameDisplay nickname='Michael Bloomberg'/>
                <NicknameDisplay nickname='Joe Biden'/>
                <NicknameDisplay nickname='Bernie Sanders'/>
                <NicknameDisplay nickname='Amy Klobuchar'/>
            </Card>
            {/* Settings display, save button at the bottom - tells if unsaved */}
            <Card>
                <form>
                </form>
            </Card>
        </React.Fragment>
    );
};

const UserFooterButton = ({ children }) => (
    <div className={style.userFooterButton}>
        { children }
    </div>
);

const UserFooter = () => (
    <div className={style.userFooter}>
        <UserFooterButton>Reset Vote</UserFooterButton>
        <UserFooterButton>Send Vote</UserFooterButton>
    </div>
);

const UserPanel = () => {
    return (
        <React.Fragment>
            <Nomination content='Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?' nickname='Lorem'/>
            <Nomination content='Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?' nickname='Lorem'/>
            <Nomination content='Vote for me!' nickname='Joe Biden'/>
            <Break h='80px'/>
            <UserFooter/>
            <div className={style.userFooterSpace}/>
        </React.Fragment>
    );
};

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
    const isAuthor = false;

    return (
        <Layout customHeader={
            (isAuthor)
                ?   <div className={style.customHeader}>
                        <div className={style.headerTab + ' '+ style.headerTabActive}>Author</div>
                        <div className={style.headerTab}>Quidem</div>
                    </div>
                : <div className={style.customHeader + ' ' + style.singleUserTab}><div>Quidem</div></div>
        }>
            <Break h='50px'/>
            <Card extraClass={style.stripedCard}><h1>Question</h1></Card>
            <Break h='80px'/>
            {(isAuthor &&
                <AuthorPanel/>
            ) ||
                <UserPanel/>
            }
        </Layout>
    );
};

export default Page;
