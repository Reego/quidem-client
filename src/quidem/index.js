import React, {
    useState,
    useEffect,
} from 'react';

import Layout, { Card, Break } from '../components/layout';
import { useSelector, useDispatcher } from 'react-redux';

import style from './quidem.module.css';

const QUIDEM_AUTHOR_ID = 0;

const State = {
    PRE_OPEN_PHASE: 1,
    PRE_VOTING_PHASE: 2,
    VOTING_PHASE: 3,
    POST_VOTING_PHASE: 4,
    CLOSED_PHASE: 5
};

const Nomination = ({ content, nickname, phase, voteNumber, removable, selectEvent, nomination_id }) => (

    <Card extraClass={
        (phase === State.VOTING_PHASE)
        ? style.nomination + ' ' + style.pointerCursor
        : style.nomination
    }>
        { (phase === State.VOTING_PHASE &&
            (<div onClick={() => selectEvent(nomination_id)} className={style.nominationVotingSection}>
                {phase === State.VOTING_PHASE &&
                    <span>VOTE</span>
                }
                {voteNumber !== -1 &&
                    <span className={style.voteNumber}>{voteNumber}</span>
                }
            </div>)) ||
            (removable) &&
            (
                (<div onClick={() => selectEvent(nomination_id)} className={style.nominationVotingSection + ' ' + style.removable}>
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

const UserFooter = ({ phase, resetVote }) => (
    <div className={style.userFooter}>
        { (phase === State.VOTING_PHASE &&
            <React.Fragment>
                <div onClick={resetVote} className={style.userFooterButton}>Reset Vote</div>
            </React.Fragment>) ||
            (phase === State.POST_VOTING_PHASE) &&
            (
                <h3>Awaiting Vote Results...</h3>
            )
        }
    </div>
);

const Page = () => {

    const socket = {
        send: (obj) => {
            alert(obj);
        }
    }
    //useSelector(state => state.socket);
    if(socket === null)
    {
        alert("Null socket!");
    }
    const quidem = useSelector(state => state.quidem);
    const user = useSelector(state => state.user);

    const users = quidem.users;
    const phase = quidem.phase;
    const settings = quidem.settings;
    const votes = quidem.votes;
    const nominations = quidem.nominations;

    const isAuthor = user.consumer_id === QUIDEM_AUTHOR_ID;
    const [authorTabOpen, setAuthorTabOpen] = useState(isAuthor);

    const userVotes = quidem.vote;

    const nicknameComponents = [];
    if(authorTabOpen)
    {
        let i = 0;
        for(let key in users)
        {
            nicknameComponents.push(
                <NicknameDisplay key={i} nickname={users[key]}/>
            )
            i++;
        }
    }

    const onVote = (nomination_id) => {
        const index = userVotes.indexOf(nomination_id)
        if(index > -1) {
            userVotes.splice(index, 1);
        }
        else {
            userVotes.push(nomination_id);
        }
        socket.send(userVotes);
    };

    const onRemoveNomination = (nomination_id) => {
        socket.send('REMOVE ' + nomination_id);
    };

    const nominationComponents = [];
    const authorNominationComponents = []
    let userHasNomination = isAuthor;

    const nominationSelectEvent = (phase === State.VOTING_PHASE)
        ? onVote
        : onRemoveNomination

    for(let i = 0; i < nominations.length; i++) {
        const nomination = nominations[i];
        if(!userHasNomination && user.consumer_id === -nomination.nomination_id) {
            userHasNomination = true;
        }
        const nominationIndexInVote = userVotes.indexOf(nomination.nomination_id);
        const component = <Nomination key={i}
            voteNumber={nominationIndexInVote}
            content={nomination.nomination}
            nickname={
                (nomination.nomination_id >= 0) ? 'AUTHOR' : users[-nomination.nomination_id]
            }
            phase={quidem.phase}
            removable={
                (-nomination.nomination_id === user.consumer_id || isAuthor) && phase < State.POST_VOTING_PHASE
            }
            selectEvent={nominationSelectEvent}
            nomination_id={nomination.nomination_id} />
        nominationComponents.push(component);
    }

    const customHeader = (isAuthor)
    ?   <div className={style.customHeader}>
            <div className={
                (authorTabOpen) ? style.headerTab + ' ' + style.headerTabActive : style.headerTab
            } onClick={
                () => setAuthorTabOpen(true)
            }>Author</div>
            <div className={
                (!authorTabOpen) ? style.headerTab + ' ' + style.headerTabActive : style.headerTab
            } onClick={
                () => setAuthorTabOpen(false)
            }>Quidem</div>
        </div>
    :
        <div className={style.customHeader + ' ' + style.singleUserTab}><div>Quidem</div></div>

    const MainLayout = ({ children }) => (
        <Layout customHeader={customHeader}>
            <Break h='50px'/>
            <Card extraClass={style.stripedCard}><h1>Question</h1></Card>
            <Break h='80px'/>
            { children }
        </Layout>
    )

    const AuthorTab = () => (
        <React.Fragment>
            <Card>
                { nicknameComponents }
            </Card>
            {/* Settings display, save button at the bottom - tells if unsaved */}
            <Card>
                <form onSubmit={(e) => {
                    socket.send("Submit form");
                }} className={style.settings}>
                    { phase == State.PRE_OPEN_PHASE &&
                            <React.Fragment>
                            <input type='text' name='question' placeholder='Question'/>
                            <p>Current: </p>
                        </React.Fragment>
                    }
                    <span>User Visibility</span><input type='checkbox' name='userVisibility'/>
                    <p>Current: False</p>
                    <span>Vote Processing Algorithm</span><input type='checkbox' name='userVisibility'/>
                    <p>Current: </p>
                    { phase < State.VOTING_PHASE &&
                        <React.Fragment>
                            <span>Allow User Nomination</span><input type='checkbox' name='allowUserNomination'/>
                            <p>Current: True</p>
                            <span>Voting Slots</span><input type='number' min={1} name='votingSlots' defaultValue={5}/>
                            <p>Current: 4</p>
                        </React.Fragment>
                    }
                    <input type='submit' value='Submit'/>
                </form>
            </Card>
            <Break h='50px'/>
        </React.Fragment>
    );
    const UserTab = () => (
        <React.Fragment>
            { (phase === State.PRE_VOTING_PHASE && !userHasNomination) || (isAuthor && phase === State.PRE_OPEN_PHASE) &&
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
            { (isAuthor || (phase === State.VOTING_PHASE || phase === State.PRE_VOTING_PHASE)) && nominationComponents }
            {/*<Nomination phase={phase} removable={true} content='Vote for me!' nickname='Joe Biden'/>*/}
            <Break h='80px'/>
            { phase > State.PRE_VOTING_PHASE &&
                <React.Fragment>
                    <UserFooter resetVote={() => socket.send('RESET VOTE')} phase={phase}/>
                    <div className={style.userFooterSpace}/>
                </React.Fragment>
            }
        </React.Fragment>
    );

    return (
        <MainLayout>
            {
                (authorTabOpen &&
                    <AuthorTab/>) ||
                    <UserTab/>
            }
        </MainLayout>
    );
};

export default Page;
