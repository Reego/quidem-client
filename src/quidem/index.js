import React, {
    useState,
    useEffect,
} from 'react';

import Layout, { Card, Break } from '../components/layout';
import { useSelector, useDispatcher } from 'react-redux';

import style from './quidem.module.css';

const State = {
    PRE_VOTING_PHASE: 1,
    VOTING_PHASE: 2,
    POST_VOTING_PHASE: 3,
};

const Nomination = ({ content, nickname, phase, removable }) => (

    <Card extraClass={
        (phase === State.VOTING_PHASE)
        ? style.nomination + ' ' + style.pointerCursor
        : style.nomination
    }>
        { (phase !== State.PRE_VOTING_PHASE &&
            (<div className={style.nominationVotingSection}>
                {phase === State.VOTING_PHASE &&
                    <span>VOTE</span>
                }
                <span className={style.voteNumber}>3</span>
            </div>)) ||
            (phase === State.PRE_VOTING_PHASE && removable) &&
            (
                (<div className={style.nominationVotingSection + ' ' + style.removable}>
                    <span>REMOVE</span>
                    <span className={style.voteNumber}>X</span>
                </div>))
        }
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

const UserFooter = ({ phase }) => (
    <div className={style.userFooter}>
        { (phase === State.VOTING_PHASE &&
            <React.Fragment>
                <div className={style.userFooterButton}>Reset Vote</div>
                <div className={style.userFooterButton}>>Send Vote</div>
            </React.Fragment>) ||
            (
                <h3>Awaiting Vote Results...</h3>
            )
        }
    </div>
);

const UserPanel = ({ phase, nominations }) => {
    return (
        <React.Fragment>
            { phase === State.PRE_VOTING_PHASE &&
                <React.Fragment>
                    <Card>
                        <h1>Create Nomination</h1>
                        <form className={style.nominationCreationPanel}>
                            <input type='text' placeholder='Nomination' required/>
                            <div className={style.userFooterButton}>Send Nomination</div>
                        </form>
                    </Card>
                    <Break h='20px'/>
                </React.Fragment>
            }
            { nominations }
            <Nomination phase={phase} removable={true} content='Vote for me!' nickname='Joe Biden'/>
            <Break h='80px'/>
            { phase === State.VOTING_PHASE &&
                <React.Fragment>
                    <UserFooter/>
                    <div className={style.userFooterSpace}/>
                </React.Fragment>
            }
        </React.Fragment>
    );
};

const Page = () => {

    const socket = useSelector(state => state.socket);

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
    const onAuthorTab = false
    const phase = State.POST_VOTING_PHASE;

    const customHeader = (isAuthor)
    ?   <div className={style.customHeader}>
            <div className={style.headerTab + ' '+ style.headerTabActive}>Author</div>
            <div className={style.headerTab}>Quidem</div>
        </div>
    :
        <div className={style.customHeader + ' ' + style.singleUserTab}><div>Quidem</div></div>

    return (
        <Layout customHeader={customHeader}>
            <Break h='50px'/>
            <Card extraClass={style.stripedCard}><h1>Question</h1></Card>
            <Break h='80px'/>
            { (isAuthor && onAuthorTab && <AuthorPanel/>) || <UserPanel phase={phase}/> }
        </Layout>
    );
};

export default Page;
