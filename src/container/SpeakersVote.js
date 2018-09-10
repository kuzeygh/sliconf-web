import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as EventActions from '../reducks/modules/event'
import { connect } from 'react-redux';
import PageHead from "../components/PageHead";
import Loading from "../components/Loading";
import * as Silly from '../reducks/modules/silly'
import ReactTooltip from 'react-tooltip'
import Ionicon from 'react-ionicons'
import SpeakerListVote from "../components/SpeakerListVote";

class Statistics extends Component {

      state = {
            loading: true,
            eventId: this.props.match.eventId,
            users: 0,
            usersUnique: 0,
            approved: 0,
            unapproved: 0,
            mostQuestionedSpeech: "",
            mostLikedQuestion: "",
            active: "",
            mode: 0,
            speakers: [],
      };

      componentWillReceiveProps(nextProps) {
            if (nextProps.event && nextProps.event.statics && nextProps.event.statics !== this.props.event.statics && !nextProps.event.loading) {
                  //console.log(nextProps.event.statics);
                  this.setState({
                        loading: false,
                        approved: nextProps.event.statics.approvedComments,
                        unapproved: nextProps.event.statics.deniedComments,
                        users: nextProps.event.statics.totalUsers.allFetched,
                        usersUnique: nextProps.event.statics.totalUsers.uniqueCount,
                        mostQuestionedSpeech: nextProps.event.statics.mostCommentedSession ? nextProps.event.statics.mostCommentedSession.topic : '-',
                        mostLikedQuestion: nextProps.event.statics.mostLikedComment ? nextProps.event.statics.mostLikedComment.commentValue : '-',
                  })
            }

            if (this.props.speaker !== nextProps.speaker) {
                  this.setState({
                        speakers: nextProps.speaker ? nextProps.speaker.speakers : [],
                  }, () => {
                        if (this.state.speakers && this.state.speakers.length > 0) {
                              this.props.changeStep(30);
                        } else {
                              this.props.changeStep(19);
                        }
                  })
            }

      }

      componentWillMount() {
            this.props.getStatics(this.props.match.params.eventId);
            this.props.changeStep(23);
      }


      returnIcons = (what) => {
            return this.state.active === what ? this.state.mode === 1
                  ? <Ionicon icon={"ios-arrow-up"} style={{ verticalAlign: "top" }} />
                  : <Ionicon icon={"ios-arrow-down"} style={{ verticalAlign: "top" }} />
                  : <Ionicon icon={"ios-remove"} style={{ verticalAlign: "top" }} />
      };

      render() {
            return (

                  <div className="container mtop">
                        <PageHead where={"/events/" + this.props.match.params.eventId + "/statistics"} title="Speakers Vote" {...this.props} />
                        <Loading row="3" loading={this.state.loading}>
                              <SpeakerListVote eventId={this.props.match.params.eventId} speakers={this.props.speaker.speakers} topProps={this.props} />
                        </Loading>
                  </div>
            );
      }
}
const mapStateToProps = (state, ownProps) => {
      return {
            event: state.event,
            user: state.auth.user,
            speaker: state.speaker,
            auth: state.auth,
            silly: state.silly,
      }
}

const mapDispatchToProps = (dispatch, ownProps) => {
      return { ...bindActionCreators({ ...EventActions, ...Silly }, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)