import React from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as talkActions from '../reducks/modules/speaker'
import PageHead from "../components/PageHead";
import Loading from "../components/Loading";
import TalkList from "../components/TalkList";

class Talks extends React.Component {

   componentWillMount(){
      this.props.fetchEventTalks(this.props.match.params.eventId);
   }

   render() {
      return (
         <div className="container mtop">
            <div className="row">
               <div className="twelve columns">
                  <PageHead title="All Talks"/>
                  <Loading row="3" loading={this.props.speaker.loading}>
                     <TalkList talks={this.props.speaker.talks}/>
                     <div className="row mtop25 mbottom100">
                        <div className="twelve columns">
                           <Link to="./addtalk" className="button button-primary">Add Talk</Link>
                        </div>
                     </div>
                  </Loading>
               </div>
            </div>
         </div>
      );
   }
}


const mapStateToProps = (state, ownProps) => {
   return {
      speaker: state.speaker,
      auth: state.auth,
   }
}


const mapDispatchToProps = (dispatch, ownProps) => {
   return {...bindActionCreators(talkActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Talks)