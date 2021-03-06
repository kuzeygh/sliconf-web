import React from 'react';
import Ionicon from 'react-ionicons'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames';

const EventsNotAvailable = () => {
    return (
        <tr>
            <td colSpan="6" style={{marginBottom: "10px"}}>No events to be listed!</td>
        </tr>
    )
};

const PercentageCircle = (props) => {
    return (
        <div className={classNames('percentage', {'y': (!props.failed)})} data-perc={props.percentage}>
            {props.failed ?
                <div id="percentageActiveBorder" style={{
                    backgroundColor: "#F44336",
                    backgroundImage: (props.percentage * 3.6 > 180 ? 'linear-gradient(' + (props.percentage * 3.6 - 90) + 'deg, transparent 50%, #F44336 50%),linear-gradient(90deg, #ffb9b4 50%, transparent 50%)' : 'linear-gradient(' + (90 + (props.percentage * 3.6)) + 'deg, transparent 50%, #ffb9b4 50%),linear-gradient(90deg, #ffb9b4 50%, transparent 50%)')
                }} className="percentage-active-border">
                    <div className="percentageCircle"/>
                </div>
                :
                <div id="percentageActiveBorder"
                     style={{backgroundImage: (props.percentage * 3.6 > 180 ? 'linear-gradient(' + (props.percentage * 3.6 - 90) + 'deg, transparent 50%, #29b573 50%),linear-gradient(90deg, #8ddeb8 50%, transparent 50%)' : 'linear-gradient(' + (90 + (props.percentage * 3.6)) + 'deg, transparent 50%, #8ddeb8 50%),linear-gradient(90deg, #8ddeb8 50%, transparent 50%)')}}
                     className="percentage-active-border">
                    <Ionicon icon="ios-checkmark" fontSize="20px" color="white"/>
                </div>
            }
        </div>
    )
};

class AdminEventList extends React.Component {

    state = {
        active: "",
        mode: 0,
        events: this.props.admin && this.props.admin.events && this.props.admin.events.returnObject ? this.props.admin.events.returnObject : [],
    };

    sortTable = (what, type) => {
        let cloneEvents = this.props.events ? this.props.events.slice(0) : [];
        if (type) {
            return cloneEvents.sort(function (a, b) {
                if (type === 1) {
                    return a[what].toString().localeCompare(b[what].toString())
                } else if (type === 2) {
                    return b[what].toString().localeCompare(a[what].toString())
                } else {
                    return 0
                }
            })
        } else {
            return this.props.events
        }
    };

    changeOrder = (which) => {
        if (which === this.state.active) {
            if (this.state.mode === 1) {
                this.setState({
                    mode: 2,
                    events: this.sortTable(which, 2),
                });
            } else if (this.state.mode === 2) {
                this.setState({
                    mode: 0,
                    active: "",
                    events: this.sortTable(which, 0),
                });
            }
        } else {
            this.setState({
                mode: 1,
                active: which,
                events: this.sortTable(which, 1),
            });
        }
    };

    returnIcons = (what) => {
        return this.state.active === what ? this.state.mode === 1
            ? <Ionicon icon={"ios-arrow-up"} style={{verticalAlign: "top"}}/>
            : <Ionicon icon={"ios-arrow-down"} style={{verticalAlign: "top"}}/>
            : <Ionicon icon={"ios-remove"} rotate={false} style={{verticalAlign: "top"}}/>
    };

    tooler = [];

    pusher = (e) => {
        //return yazidirilmasin diye
        this.tooler.push(e);
    };

    render() {
        this.tooler = [];
        return (
            <div>
                <div className="row">
                    <div className="twelve columns">
                        <h3>Events (Total of {this.state.events && this.state.events.length})</h3>
                    </div>
                </div>
                <div className="row events">
                    <div className="twelve columns">
                        <div className="docs-example">

                            <table className="u-full-width">
                                <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th onClick={() => {
                                        this.changeOrder("name")
                                    }}>Title {this.returnIcons("name")}</th>
                                    <th onClick={() => {
                                        this.changeOrder("key")
                                    }} style={{textAlign: "center"}}>Key {this.returnIcons("key")}</th>
                                    <th onClick={() => {
                                        this.changeOrder("startDate")
                                    }} style={{textAlign: "center"}}>Date {this.returnIcons("startDate")}</th>
                                    <th style={{textAlign: "center"}}>Email</th>
                                    <th style={{textAlign: "center"}}>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(this.state.events && this.state.events.length) ? null : <EventsNotAvailable/>}
                                {this.state.events ? this.state.events.map((event) => {
                                    return <tr data-tip="Click to Edit" data-offset="{'top': 2}" key={event.id} onClick={() => this.props.history.push('/admin/' + event.key + '/edit')}>
                                        <td>
                                            <div className='eventimage'
                                                 style={{backgroundImage: 'url(https://app.sliconf.com/api/image/get/' + event.logoPath + ')'}}/>
                                        </td>
                                        <td>{event.name}</td>
                                        <td style={{textAlign: "center"}} className="miniCode">{event.key}</td>
                                        <td style={{textAlign: "center"}}>{("0" + new Date(event.startDate).getDate()).slice(-2) + "." + ("0" + (new Date(event.startDate).getMonth() + 1)).slice(-2) + "." + new Date(event.startDate).getFullYear()}</td>
                                        <td style={{textAlign: "center"}}>{event.userObject ? event.userObject.email : '-'}</td>
                                        <td style={{textAlign: "center"}}>
                                            {(event.status === true) ?
                                                <div
                                                    data-for={event.statusDetails.optionalFailed.length > 0 ? 'maybe' + event.key : ''}
                                                    data-tip>
                                                    <PercentageCircle
                                                        percentage={event.statusDetails ? event.statusDetails.percentage : 0}
                                                        failed={event.statusDetails.failed.length > 0}/>
                                                </div>
                                                :
                                                <div data-for={'global' + event.key} data-tip>
                                                    <PercentageCircle
                                                        percentage={event.statusDetails ? event.statusDetails.percentage : 0}
                                                        failed={event.statusDetails.failed.length > 0}/>
                                                </div>
                                            }</td>
                                        {this.pusher(<div key={event.id}><ReactTooltip className={"higher"}
                                                                                       id={'global' + event.key}
                                                                                       place="left" type="dark"
                                                                                       effect="solid">
                                            This event will NOT show up on Mobile Devices.<br/>Please add more info
                                            about your Event<br/>
                                            <div style={{whiteSpace: "pre"}}>
                                                {event.statusDetails.failed.join("\n")}
                                            </div>
                                            <div style={{whiteSpace: "pre"}}>
                                                {event.statusDetails.optionalFailed.join("\n")}
                                            </div>
                                        </ReactTooltip>

                                            <ReactTooltip className={"higher"} id={'maybe' + event.key} place="left"
                                                          type="dark" effect="solid">
                                                This event will show up on Mobile Devices<br/> but participants can
                                                always use more info.<br/>
                                                <div style={{whiteSpace: "pre"}}>
                                                    {event.statusDetails.optionalFailed.join("\n")}
                                                </div>
                                            </ReactTooltip></div>)}

                                    </tr>
                                }) : null}
                                </tbody>
                            </table>
                            {this.tooler.map((e) => {
                                return e;
                            })}
                            <ReactTooltip place="bottom" type="dark" effect="solid"/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default AdminEventList