import React, {
    useState,
    useEffect,
} from 'react';

import { Redirect } from 'react-router-dom';

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

    <Card selectEvent={
        (phase === State.VOTING_PHASE && !removable)
        ? () => selectEvent(nomination_id)
        : () => {}
    }
    extraClass={
        (phase === State.VOTING_PHASE)
        ? style.nomination + ' ' + style.pointerCursor
        : style.nomination
    }>
        { (phase >= State.VOTING_PHASE &&
            (<div className={style.nominationVotingSection}>
                {phase === State.VOTING_PHASE &&
                    <span>VOTE</span>
                }
                {voteNumber !== -1 &&
                    <span className={style.voteNumber}>{voteNumber+1}</span>
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

const NicknameDisplay = ({ nickname, onselect }) => <div className={style.nicknameDisplay}><span onClick={()=>onselect()}>{ nickname }</span></div>

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

    // const socket = {
    //     send: (obj) => {
    //         alert(obj);
    //     }
    // }
    //useSelector(state => state.socket);
    // if(socket === null)
    // {
    //     alert("Null socket!");
    // }

    const quidem = useSelector(state => state.quidem);
    const user = useSelector(state => state.user);
    const socket = useSelector(state => state.socket);

    const [authorTabOpen, setAuthorTabOpen] = useState(false);

    if(!quidem) {
        return <Redirect to='/'/>
    }

    const users = quidem.users;
    const phase = quidem.phase;
    const settings = quidem.settings;
    // const votes = user.votes;
    const nominations = quidem.nominations;
    const calculatedVotes = quidem.calculated_votes;

    const isAuthor = user.consumer_id === QUIDEM_AUTHOR_ID;

    let userVotes = user.votes;

    const nicknameComponents = [];
    if(authorTabOpen)
    {
        let i = 0;
        for(let key in users)
        {
            const g = key;
            nicknameComponents.push(
                <NicknameDisplay key={i} onselect={()=>socket.send({
                    action: 3,
                    consumer_id: g,
                    body: {}
                })} nickname={users[key]}/>
            )
            i++;
        }
    }

    const onVote = (nomination_id) => {
        if(!userVotes) {
            userVotes = [];
        }
        const index = userVotes.indexOf(nomination_id)
        if(index > -1) { // removes vote if already in vote set
            userVotes.splice(index, 1);
        }
        else {
            userVotes.push(nomination_id);
        }
        socket.send({
            action: 1,
            consumer_id: user.consumer_id,
            body: {
                vote_set: userVotes
            }
        });
    };

    const onRemoveNomination = (nomination_id) => {
        socket.send({
            action: 5,
            consumer_id: user.consumer_id,
            body: {
                nomination_id
            }
        });
    };

    const nominationComponents = [];
    const authorNominationComponents = [];
    let userHasNomination = isAuthor;

    const nominationSelectEvent = (phase === State.VOTING_PHASE)
        ? onVote
        : onRemoveNomination;

    if(phase === State.CLOSED_PHASE && calculatedVotes !== undefined) {
        console.log(calculatedVotes);
        userHasNomination = true;
        for(let i = 0; i < calculatedVotes.length; i++) {
            const nomination = calculatedVotes[i];
            const component = <Nomination key={i}
                voteNumber={i}
                content={nomination.nomination + ' - ' + nomination.votes}
                nickname={
                    (nomination.nomination_id >= 0) ? 'AUTHOR' : users[-nomination.nomination_id]
                }
                phase={quidem.phase}
                removable={false}
                selectEvent={()=>{}}
                nomination_id={nomination.nomination_id} />
            nominationComponents.push(component);
            if(!isAuthor) {
                break;
            }
        }
    }
    else if(nominations !== undefined) {
        for(let i = 0; i < nominations.length; i++) {
            const nomination = nominations[i];
            if(!userHasNomination && user.consumer_id === -nomination.nomination_id) {
                userHasNomination = true;
            }
            const nominationIndexInVote = (userVotes != undefined) ? userVotes.indexOf(nomination.nomination_id) : -1;
            const component = <Nomination key={i}
                voteNumber={nominationIndexInVote}
                content={nomination.nomination}
                nickname={
                    (nomination.nomination_id >= 0) ? 'AUTHOR' : users[-nomination.nomination_id]
                }
                phase={quidem.phase}
                removable={
                    (-nomination.nomination_id === user.consumer_id || isAuthor) && phase < State.VOTING_PHASE
                }
                selectEvent={nominationSelectEvent}
                   nomination_id={nomination.nomination_id} />
                nominationComponents.push(component);
        }
    }

    if(phase === State.CLOSED_PHASE) {
        return (<Layout customHeader={<div className={style.customHeader + ' ' + style.singleUserTab}><div>Quidem</div></div>}>
            <Break h='50px'/>
            <Card extraClass={style.stripedCard}><h1>{quidem.settings.question}</h1></Card>
            <Break h='80px'/>
            { nominationComponents }
        </Layout>);
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
            <Card extraClass={style.stripedCard}><h1>{quidem.settings.question}</h1></Card>
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
                    e.preventDefault();

                    const elements = e.target.elements;

                    const body = {};

                    const checkedRadioInput = document.querySelector('input[name=algorithm]:checked');
                    let alg = (!checkedRadioInput) ? settings.voting_algorithm : checkedRadioInput.value;

                    body['voting_algorithm'] = alg;

                    const questionInput = elements['question'];
                    if(questionInput && phase < State.PRE_VOTING_PHASE) {
                        body['question'] = questionInput.value;
                    }

                    const maxVotingSlotsInput = elements['votingSlots'];
                    if(maxVotingSlotsInput && phase < State.VOTING_PHASE) {
                        body['max_voting_slots'] = maxVotingSlotsInput.value;
                    }

                    socket.send({
                        action: 8,
                        consumer_id: user.consumer_id,
                        body
                    });
                }} className={style.settings}>
                    { phase < State.PRE_VOTING_PHASE &&
                            <React.Fragment>
                            <input type='text' name='question' placeholder='Question' defaultValue={quidem.settings.question}/>
                            <p>Current: {quidem.settings.question}</p>
                        </React.Fragment>
                    }
                    <h3>Vote Processing Algorithm</h3>
                        <br/>
                        <label>Linear</label><br/>
                        <input type="radio" name="algorithm" value="0"/>
                        <label>Square</label><br/>
                        <input type="radio" name="algorithm" value="1"/>
                        <label>Cube</label><br/>
                        <input type="radio" name="algorithm" value="2"/>
                        <label>Exponential</label><br/>
                        <input type="radio" name="algorithm" value="3"/>
                        <label>Logarithmic</label><br/>
                        <input type="radio" name="algorithm" value="4"/>
                    <p>Current: {
                        (settings.voting_algorithm === 0 && 'Linear') || (settings.voting_algorithm === 1 && 'Square') || (settings.voting_algorithm === 2 && 'Cube') || (settings.voting_algorithm === 3 && 'Exponential') || (settings.voting_algorithm === 4 && 'Logarithmic')
                    }</p>
                    { phase < State.VOTING_PHASE &&
                        <React.Fragment>
                            <h3>Voting Slots</h3><input type='number' min={1} name='votingSlots' defaultValue={quidem.settings.max_voting_slots}/>
                            <p>Current: { settings.max_voting_slots }</p>
                        </React.Fragment>
                    }
                    <br/>
                    <input type='submit' value='Save Settings'/>
                </form>
            </Card>
            <Break h='50px'/>
            <Card>The Quidem code is {socket.session_id}<br/>The current phase is { (phase === State.PRE_OPEN_PHASE && 'PRE-OPEN') || (phase === State.PRE_VOTING_PHASE && 'PRE-VOTING') || (phase === State.VOTING_PHASE && 'VOTING') || (phase === State.POST_VOTING_PHASE && 'POST-VOTING')}</Card>
            <Break h='30px'/>
            <div
                onClick={()=>{socket.send({
                    action: 6,
                    consumer_id: user.consumer_id,
                    body: {
                    }
                    })}}
                className={style.nextPhaseButton}>Next Phase</div>
            <Break h='30px'/>
        </React.Fragment>
    );
    const UserTab = () => (
        <React.Fragment>
            { ((phase === State.PRE_VOTING_PHASE && !userHasNomination) || (isAuthor && (phase === State.PRE_OPEN_PHASE || phase === State.PRE_VOTING_PHASE))) &&
                <React.Fragment>
                    <Card>
                        <h1>Create Nomination</h1>
                        <form className={style.nominationCreationPanel} onSubmit={(e) => {
                                e.preventDefault();
                                socket.send({
                                    action: 4,
                                    consumer_id: user.consumer_id,
                                    body: {
                                        nomination: e.target.elements['nomination'].value
                                    }
                                });
                            }
                        }>
                            <input type='text' name='nomination' placeholder='Nomination' required/>
                            <input type='submit' className={style.userFooterButton} value={'Send Nomination'}/>
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
                    <UserFooter resetVote={
                        () => socket.send({
                            action: 1,
                            consumer_id: user.consumer_id,
                            body: {
                                vote_set: []
                            }
                        })
                    } phase={phase}/>
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
