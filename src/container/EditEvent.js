/* eslint-disable no-undef */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as EventActions from '../reducks/modules/event';
import * as RoomActions from '../reducks/modules/room';
import moment from 'moment';
import classNames from 'classnames';
import ImageUpload from '../components/ImageUpload';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import RoomTag from "../components/RoomTag";
import RoomCreate from "../components/RoomCreate";
import SponsorTag from "../components/SponsorTag";
import SponsorTagCreate from "../components/SponsorTagCreate";
import SponsorList from "../components/SponsorList";
import Floor from "../components/Floor";
import Loading from "../components/Loading";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");



const MapWithASearchBox = compose(
   withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2r6MrjloKbW0cgCJuZC5Taj5DJJfFIiY&v=3.exp&libraries=geometry,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
   }),
   lifecycle({
      componentWillMount() {
         const refs = {};

         this.setState({
            bounds: null,
            center: {
               lat: this.props.lat ? this.props.lat : 0, lng: this.props.lng ? this.props.lng : 0
            },
            zoom:this.props.mapdescription ? 17 : 1,
            place:"",
            markers: [],
            onMapMounted: ref => {
               refs.map = ref;
            },
            onBoundsChanged: () => {
               this.setState({
                  bounds: refs.map.getBounds(),
                  center: refs.map.getCenter(),
               })
            },
            onSearchBoxMounted: ref => {
               refs.searchBox = ref;
            },
            onPlacesChanged: () => {
               const places = refs.searchBox.getPlaces();
               places.splice(1);
               const bounds = new google.maps.LatLngBounds();

               places.forEach(place => {
                  if (place.geometry.viewport) {
                     bounds.union(place.geometry.viewport)
                  } else {
                     bounds.extend(place.geometry.location)
                  }
               });
               const nextMarkers = places.map(place => ({
                  position: place.geometry.location,
               }));
               const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
               this.setState({
                  center: nextCenter,
                  markers: nextMarkers,
                  zoom:17,
                  place:places[0].formatted_address,
               });
               this.props.callback(this.state.place, nextCenter.lat(), nextCenter.lng());
            },
         })
      },
   }),
   withScriptjs,
   withGoogleMap
)(props =>
   <GoogleMap
      defaultOptions={{
         streetViewControl: false,
         scaleControl: false,
         mapTypeControl: false,
         rotateControl: false,
         fullscreenControl: false
      }}
      ref={props.onMapMounted}
      defaultZoom={1}
      zoom={props.zoom}
      center={props.center}
      onBoundsChanged={props.onBoundsChanged}
      gestureHandling={'greedy'}
   >
      {props.lat ? <Marker position={{lat: props.lat, lng: props.lng}} /> : ''}
      <SearchBox
         ref={props.onSearchBoxMounted}
         bounds={props.bounds}
         controlPosition={google.maps.ControlPosition.TOP_LEFT}
         onPlacesChanged={props.onPlacesChanged}
      >
         <input
            type="text"
            placeholder= {props.mapdescription ? props.mapdescription : "Search"}
            style={{
               marginLeft:'1%',
               boxSizing: `border-box`,
               border: `1px solid transparent`,
               width: `98%`,
               height: `32px`,
               marginTop: `10px`,
               padding: `0 12px`,
               borderRadius: `3px`,
               boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
               fontSize: `14px`,
               outline: `none`,
               textOverflow: `ellipses`,
            }}
         />
      </SearchBox>
      {props.markers.map((marker, index) =>
         <Marker key={index} position={marker.position} />
      )}
   </GoogleMap>
);

class EditEvent extends React.Component {

   constructor(props){
      super(props);
      this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
   };

   forceUpdateHandler(){
      this.forceUpdate();
   };

   setNewPlace = (place,lat,lng) => {
      this.setState({
         mapdescription : place,
         lat: lat,
         lng: lng,
         changed:true,
      });
   };

   componentDidMount(){
      this.props.fetchEvent(this.props.match.params.eventId);
   }

   resetAll = () => {
      this.closeReset();
      this.setState({
         loading:true,
      });
      this.props.fetchEvent(this.props.match.params.eventId);
   };

   state = {
      loading:true,
      id: this.props.match.eventId,
      name: "",
      startdate: moment(),
      enddate: moment(),
      logo: "",
      description: "",
      youtube: "",
      twitter: "",
      facebook: "",
      instagram: "",
      web: "",
      phone: "",
      phonea: "",
      lat: "",
      lng: "",
      mapdescription: "",
      rooms:"",
      sponsors: "",
      tags: "",
      floorplan : "",
      modalImage: null,
      activeTab: "general",
      isLoading:false,
      roomName:"",
      tagName:"",
      modalImageId:"",
      modalIsOpen:false,
      modalName:"",
      place:"",
      changed:false,
      nextTab:'general',
      sureIsOpen:false,
      roomAlertIsOpen:false,
      modalIsNew:false,
      nthNewSponsor:1,
      nthNewFloor:1,
      nthChange:0,
      resetIsOpen:false,
      floorIsOpen:false,
      sponsorIsOpen:false,
      sponsorTagIsOpen:false,
   };

   componentWillReceiveProps(nextProps) {
      //console.log("bisiler oldu");
      if ((nextProps.event && this.props.event !== nextProps.event) || (this.props.event && this.props.event.id !== nextProps.event.id)) {
         //console.log("event degismis");
         this.setState({
            id: nextProps.event.id ? nextProps.event.id : '',
            name: nextProps.event.name ? nextProps.event.name : '',
            startdate: nextProps.event.startdate ? moment(nextProps.event.startdate*1000) : moment(),
            enddate: nextProps.event.enddate ? moment(nextProps.event.enddate*1000) : moment(),
            logo: nextProps.event.logo ? nextProps.event.logo : '',
            description: nextProps.event.description ? nextProps.event.description : '',
            youtube: nextProps.event.about ? nextProps.event.about.social ? nextProps.event.about.social.youtube ? nextProps.event.about.social.youtube : '' : '' : '',
            twitter: nextProps.event.about ? nextProps.event.about.social ? nextProps.event.about.social.twitter ? nextProps.event.about.social.twitter : '' : '' : '',
            facebook: nextProps.event.about ? nextProps.event.about.social ? nextProps.event.about.social.facebook ? nextProps.event.about.social.facebook : '' : '' : '',
            instagram: nextProps.event.about ? nextProps.event.about.social ? nextProps.event.about.social.instagram ? nextProps.event.about.social.instagram : '' : '' : '',
            web: nextProps.event.about ? nextProps.event.about.web ? nextProps.event.about.web : '' : '',
            phone: nextProps.event.about ? nextProps.event.about.phone ? nextProps.event.about.phone[0] ? nextProps.event.about.phone[0] : '' : '' : '',
            phonea: nextProps.event.about ? nextProps.event.about.phone ? nextProps.event.about.phone[1] ? nextProps.event.about.phone[1] : '' : '' : '',
            lat: nextProps.event.about ? nextProps.event.about.location ? nextProps.event.about.location.lat ? nextProps.event.about.location.lat : '' : '' : '',
            lng: nextProps.event.about ? nextProps.event.about.location ? nextProps.event.about.location.lng ? nextProps.event.about.location.lng : '' : '' : '',
            mapdescription: nextProps.event.about ? nextProps.event.about.location ? nextProps.event.about.location.description ? nextProps.event.about.location.description : '' : '' : '',
            rooms:nextProps.event.rooms ? nextProps.event.rooms : [],
            sponsors: nextProps.event.sponsor ? nextProps.event.sponsor : {},
            tags: nextProps.event.sponsortags ? nextProps.event.sponsortags : {},
            floorplan : nextProps.event.floorplan ? nextProps.event.floorplan : [],
            loading:false,
            nthChange:this.state.nthChange+1,
         });
      }
   }

   addSpeaker = () => {
      if(this.state.logo){
         this.props.addSpeaker(this.props.match.params.eventId, {...this.getSpeakerData()})
      }
   };

   changeDateValue = (name) => {
      return (date) => {
         this.setState({[name]: moment(moment(date).unix() * 1000), changed: true})
      }
   };

   onEventImageLoaded = (logo) => {
      this.setState({logo:logo, isLoading:false, changed:true})
   };

   onFloorImageLoaded = (logo) => {
      this.setState({modalImage:logo, isLoading:false})
   };

   changeTab = (tab) => {
      this.setState({
         nextTab:tab,
      });
      if((this.state.activeTab==="general" || this.state.activeTab==="social" || this.state.activeTab==="contact") &&
         (tab==="general" || tab==="social" || tab==="contact")){
         this.setState({activeTab:tab})
      }else{
         if(this.state.changed===true) {
            this.openSure();
         }else{
            this.setState({activeTab:tab})
         }
      }
   };

   prepareReturn = (type) => {
      if (type === "general" || type === "social" || type === "contact") {
         return {
            "id": this.state.id,
            "name": this.state.name,
            "startdate": moment(this.state.startdate).unix(),
            "enddate": moment(this.state.enddate).unix(),
            "logo": this.state.logo,
            "description":  this.state.description,
            "about": {
               "social": {
                  "youtube": this.state.youtube,
                  "twitter": this.state.twitter,
                  "facebook": this.state.facebook,
                  "instagram": this.state.instagram
               },
               "web": this.state.web,
               "phone": [
                  this.state.phone,
                  this.state.phonea
               ],
               "location": {
                  "lat": this.state.lat,
                  "lng": this.state.lng,
                  "description": this.state.mapdescription
               }
            }
         }
      }else if (type === "rooms"){
         return this.props.event.rooms;
      }else if (type === "sponsors"){
         return {"sponsortags":this.props.event.sponsortags,"sponsor":this.props.event.sponsor};
      }else if (type === "floorplan"){
         return this.props.event.floorplan;
      }
   };

   save = () => {
      this.setState({
         changed:false,
      },()=>{
         console.log(JSON.stringify(this.prepareReturn(this.state.activeTab)));
         this.closeSure();
         this.changeTab(this.state.nextTab);
      });
   };


   floorRemove = (floorId) => {
      this.openFloor(floorId)
   };





   openSure = () => {
      this.setState({sureIsOpen: true});
   };

   closeSure = () => {
      this.setState({sureIsOpen: false, nextTab:this.state.activeTab});
   };

   openReset = () => {
      this.setState({resetIsOpen: true});
   };

   closeReset = () => {
      this.setState({resetIsOpen: false});
   };

   openFloor = (floorId) => {
      this.setState({floorIsOpen: true,removeFloorId:floorId});
   };

   closeFloor = () => {
      this.setState({floorIsOpen: false});
   };

   openSponsor = (sponsorId) => {
      this.setState({sponsorIsOpen: true,removeSponsorId:sponsorId});
   };

   closeSponsor = () => {
      this.setState({sponsorIsOpen: false});
   };

   openSponsorTag = (tagId) => {
      if(this.props.event.sponsor ? this.props.event.sponsor ? this.props.event.sponsor[tagId].length>0 : false : false){
         this.setState({sponsorTagIsOpen: true, removeSponsorTagId:tagId});
      }else{
         this.props.removeTagFromLocal(tagId);
      }
   };

   closeSponsorTag = () => {
      this.setState({sponsorTagIsOpen: false});
   };

   openRoomAlert = (roomId) => {
      this.setState({roomAlertIsOpen: true, alertRoomId:roomId});
   };

   closeRoomAlert = () => {
      this.setState({roomAlertIsOpen: false});
   };

   removeRoom = () => {
      this.props.removeRoomFromLocal(this.state.alertRoomId);
      this.closeRoomAlert();
   };

   openModal = (id,logo,name,tag) => {
      if(!id) {
         this.setState({
            modalId:'',
            modalImage:'',
            modalName:'',
            modalIsNew:true,
            activeSponsorTag:tag,
            modalIsOpen: true
         });
      }else{
         this.setState({
            modalId:id,
            modalImage:logo,
            modalName:name,
            modalIsOpen: true
         });
      }

   };

   modalSave = () => {
      if(this.state.modalIsNew===false){
         if(this.state.activeTab==="sponsors"){
            this.props.editSponsorFromLocal(this.state.modalId, this.state.modalName, this.state.modalImage);
         }else if(this.state.activeTab==="floorplan"){
            //sasa
            this.props.editFloorFromLocal(this.state.modalId, this.state.modalName, this.state.modalImage);
            this.setState({
               nthChange:this.state.nthChange+1,
            })
         }
      }else{
         if(this.state.activeTab==="sponsors"){
            this.props.addSponsorToLocal(this.state.modalName, this.state.modalImage ,this.state.activeSponsorTag,this.state.nthNewSponsor);
            this.setState({
               nthNewSponsor:this.state.nthNewSponsor+1,
               modalIsNew:false,
            })
         }else if(this.state.activeTab==="floorplan") {
            this.props.addFloorToLocal(this.state.modalName, this.state.modalImage,this.state.nthNewFloor);
            this.setState({
               nthNewFloor:this.state.nthNewFloor+1,
               modalIsNew:false,
            })
         }
      }
      this.closeModal();
      this.forceUpdateHandler();
      this.setState({
         changed:true,
      })
   };
   //sasasasasasasasasa
   afterOpenModal = () => {
      // references are now sync'd and can be accessed.
   };

   closeModal = () => {
      this.setState({modalIsOpen: false});
   };

   somethingChanged(){
      this.setState({changed: true});
   };

   canCreateTag = (tag, which) => {
      if(which==="rooms"){
         return this.props.event && this.props.event.rooms ? this.props.event.rooms.filter(function (el) { return el.label === tag; }).length===0 && tag!=="" : false;
      }if(which==="sponsors"){
         return this.props.event && this.props.event.sponsortags ? Object.values(this.props.event.sponsortags).filter(function (el) { return el === tag; }).length===0 && tag!=="" : false;
      }else {
         return false;
      }
   };

   addFloor = () => {
      this.openModal();
   };

   goToFloor = () => {
      this.changeTab('floorplan');
   };

   render() {
      return (

         <div className="container mtop">
            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.sureIsOpen}
               onRequestClose={this.closeSure}
               contentLabel="Are you sure?"
               style={{content : {width:400,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Save changes?</h2>
                     <p>You have unsaved changes. Please save them before changing tabs.</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeSure}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.save} className={"button-primary"}>SAVE</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.roomAlertIsOpen}
               onRequestClose={this.closeRoomAlert}
               contentLabel="Are you sure?"
               style={{content : {width:400,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Remove Room?</h2>
                     <p>Your Talks will be deattached from this room!<br />(THIS ACTION CANNOT BE UNDONE)</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeRoomAlert}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.removeRoom} className={"button-primary"}>REMOVE</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.resetIsOpen}
               onRequestClose={this.closeReset}
               contentLabel="Are you sure?"
               style={{content : {width:400,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Reset Event?</h2>
                     <p>Your event will be restored - if you didn't already saved!<br />(THIS ACTION CANNOT BE UNDONE)</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeReset}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.resetAll} className={"button-primary"}>RESET</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.floorIsOpen}
               onRequestClose={this.closeFloor}
               contentLabel="Are you sure?"
               style={{content : {width:400,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Remove Floor?</h2>
                     <p>This floor will be deleted with all rooms on it!<br />(THIS ACTION CANNOT BE UNDONE)</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeFloor}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={()=>{this.props.removeFloorFromLocal(this.state.removeFloorId);this.closeFloor();}} className={"button-primary"}>REMOVE</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.sponsorIsOpen}
               onRequestClose={this.closeSponsor}
               contentLabel="Are you sure?"
               style={{content : {width:450,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Remove Sponsor?</h2>
                     <p>This sponsor will be deleted!<br />(THIS ACTION CANNOT BE UNDONE)</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeSponsor}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={()=>{this.props.removeSponsorFromLocal(this.state.removeSponsorId);this.closeSponsor();}} className={"button-primary"}>REMOVE</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.sponsorTagIsOpen}
               onRequestClose={this.closeSponsorTag}
               contentLabel="Are you sure?"
               style={{content : {width:400,textAlign:"center"}}}
            >
               <div className="row">
                  <div className="twelve columns">
                     <h2>Remove Tag?</h2>
                     <p>This tag will be deleted with the all sponsors in it!<br />(THIS ACTION CANNOT BE UNDONE)</p>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <div className="span">
                        <button onClick={this.closeSponsorTag}>CANCEL</button>
                     </div>
                  </div>
                  <div className="six columns">
                     <div className="span">
                        <button onClick={()=>{this.props.removeTagFromLocal(this.state.removeSponsorTagId);this.closeSponsorTag();}} className={"button-primary"}>REMOVE</button>
                     </div>
                  </div>
               </div>
            </Modal>

            <Modal
               className="Modal"
               overlayClassName="Overlay"
               isOpen={this.state.modalIsOpen}
               onAfterOpen={this.afterOpenModal}
               onRequestClose={this.closeModal}
               contentLabel="Add Image"
            >
               <div className="row">
                  <div className="nine columns">
                     <h2>Add Image</h2>
                  </div>
                  <div className="three columns">
                     <button style={{float:"right"}} onClick={this.closeModal}>close</button>
                  </div>
               </div>
               <div className="row">
                  <div className="six columns">
                     <ImageUpload onLoad={this.onFloorImageLoaded} logo={"http://app.sliconf.com:8090/service/image/get/"+this.state.modalImage}>
                        {this.state.modalImage ?
                           <div className="row">
                              <div className="twelve columns">
                                 <div className="resim" style={{backgroundImage: 'url("http://app.sliconf.com:8090/service/image/get/' + this.state.modalImage + '")'}} width="100%" alt=""/>
                              </div>
                           </div>: ''}
                        }
                     </ImageUpload>
                  </div>
                  <div className="six columns">
                     <label htmlFor="modalName">Name</label>
                     <input className="u-full-width" type="text" id="modalName" value={this.state.modalName} onChange={(e) => this.setState({modalName:e.currentTarget.value})}/>
                     <div className="span" style={{float:"right"}}>
                        <button onClick={this.modalSave} className={"button-primary"}>SAVE</button>
                     </div>
                  </div>
               </div>
            </Modal>
            <div className="row">
               <div className="twelve columns">
                  <Loading row="3" loading={this.state.loading}>
                     <div className="row">
                        <div className="twelve columns">
                           <div className="row">
                              <div className="twelve columns">
                                 <h2 style={{verticalAlign:"top",display: "inline-block"}}>Edit Event</h2>
                                 <input style={{margin:"10px 30px"}} className={classNames('button-primary',{disabled:this.state.isLoading})} type="submit" onClick={this.save} defaultValue="SAVE"/>
                                 <a onClick={this.openReset}>Reset</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  <div className="container u-full-width tabs">
                     <ul className="navbar-list clickable noselect">
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="general"})}
                            onClick={(e) => this.changeTab('general')}><a className="navbar-link">General</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="social"})}
                            onClick={(e) => this.changeTab('social')}><a className="navbar-link">Social</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="contact"})}
                            onClick={(e) => this.changeTab('contact')}><a className="navbar-link">Contact</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="rooms"})}
                            onClick={(e) => this.changeTab('rooms')}><a className="navbar-link">Rooms</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="sponsors"})}
                            onClick={(e) => this.changeTab('sponsors')}><a className="navbar-link">Sponsors</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="floorplan"})}
                            onClick={(e) => this.changeTab('floorplan')}><a className="navbar-link">Floor Plan</a></li>
                        <li className={classNames('navbar-item',{'active':this.state.activeTab==="advanced"})}
                            onClick={(e) => this.changeTab('advanced')}><a className="navbar-link">Advanced</a></li>
                     </ul>
                  </div>
                  <div className="tabContainer" style={{height: "800px",position: "relative"}}>
                     <div className={classNames('tab',{'active':this.state.activeTab==="general"})}>
                        <div className="row mtop50">
                           <div className="six columns">
                              <h3>General</h3>
                              <div className="twelve columns">
                                 <label htmlFor="name">Event Name</label>
                                 <input className="u-full-width" type="text" id="name" value={this.state.name} onChange={(e) => this.setState({name: e.currentTarget.value, changed:true})} />
                              </div>
                              <div className="twelve columns">
                                 <div className="six columns">
                                    <label htmlFor="startdate">Event Starts</label>
                                    <DatePicker
                                       className="u-full-width"
                                       minDate={moment()}
                                       maxDate={moment().add(5, "years")}
                                       selected={moment(this.state.startdate)}
                                       selectsStart
                                       startDate={this.state.startdate}
                                       endDate={this.state.enddate}
                                       onChange={this.changeDateValue('startdate')}
                                    />
                                 </div>
                                 <div className="six columns">
                                    <label htmlFor="enddate">Event Ends</label>
                                    <DatePicker
                                       className="u-full-width"
                                       minDate={moment()}
                                       maxDate={moment().add(5, "years")}
                                       selected={moment(this.state.enddate)}
                                       selectsEnd
                                       startDate={this.state.startdate}
                                       endDate={this.state.enddate}
                                       onChange={this.changeDateValue('enddate')}
                                    />
                                 </div>
                              </div>
                              <div className="twelve columns">
                                 <label htmlFor="desc">Event Description</label>
                                 <textarea style={{height:"150px"}} className="u-full-width" id="desc" value={this.state.description} onChange={(e) => this.setState({description: e.currentTarget.value, changed: true})}/>
                              </div>
                           </div>
                           <div className="six columns mtop50">
                              <div className="row">
                                 <div className="twelve columns">
                                    {this.state.logo ?
                                          <ImageUpload onLoad={this.onEventImageLoaded} logo={"http://app.sliconf.com:8090/service/image/get/"+this.state.logo}>
                                          <div className="row">
                                                <div className="twelve columns">
                                                   <div className="resim" style={{backgroundImage: 'url("http://app.sliconf.com:8090/service/image/get/' + this.state.logo + '")'}} width="100%" alt="" />
                                                </div>
                                             </div>
                                          </ImageUpload>: <ImageUpload onLoad={this.onEventImageLoaded} logo={""}/>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="social"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Social</h3>
                              <div className="twelve columns">
                                 <div className="six columns">
                                    <label htmlFor="facebook">facebook</label>
                                    <input className="u-full-width" type="text" id="facebook" value={this.state.facebook} onChange={(e) => this.setState({facebook:e.currentTarget.value, changed:true})}/>
                                 </div>
                                 <div className="six columns">
                                    <label htmlFor="instagram">instagram</label>
                                    <input className="u-full-width" type="text" id="instagram" value={this.state.instagram} onChange={(e) => this.setState({instagram:e.currentTarget.value, changed:true})}/>
                                 </div>
                              </div>
                              <div className="twelve columns">
                                 <div className="six columns">
                                    <label htmlFor="youtube">Youtube</label>
                                    <input className="u-full-width" type="text" id="youtube" value={this.state.youtube} onChange={(e) => this.setState({youtube:e.currentTarget.value, changed:true})}/>
                                 </div>
                                 <div className="six columns">
                                    <label htmlFor="twitter">twitter</label>
                                    <input className="u-full-width" type="text" id="twitter" value={this.state.twitter} onChange={(e) => this.setState({twitter:e.currentTarget.value, changed:true})}/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="contact"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Contact</h3>
                              <div className="twelve columns" style={{marginLeft:0}}>
                                 <div className="twelve columns">
                                    <label htmlFor="website">Website</label>
                                    <input className="u-full-width" type="text"id="website" value={this.state.web} onChange={(e) => this.setState({web:e.currentTarget.value, changed:true})}/>
                                 </div>
                              </div>
                              <div className="twelve columns" style={{marginLeft:0}}>
                                 <div className="six columns">
                                    <label htmlFor="phone">Phone</label>
                                    <input className="u-full-width" type="text" id="phone" value={this.state.phone} onChange={(e) => this.setState({phone:e.currentTarget.value, changed:true})}/>
                                 </div>
                                 <div className="six columns">
                                    <label htmlFor="phonea">Alternative Phone</label>
                                    <input className="u-full-width" type="text" id="phonea" value={this.state.phonea} onChange={(e) => this.setState({phonea:e.currentTarget.value, changed:true})}/>
                                 </div>
                              </div>
                              <div className="twelve columns" style={{marginLeft:0}}>
                                 <div className="twelve columns">
                                    <label htmlFor="lokasyon">Location</label>
                                    <MapWithASearchBox mapdescription={this.state.mapdescription} lat={this.state.lat} lng={this.state.lng} desc={this.state.mapdescription} callback={this.setNewPlace} key={this.state.activeTab} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="rooms"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Rooms</h3>
                              {this.state.floorplan.length===0 ? <div><h4>To add room for this event, please add floor first.</h4><button onClick={this.goToFloor}>Go To Floor Tab</button></div> : <div>
                                 <RoomCreate floorPlan={this.state.floorplan} canCreateTag={this.canCreateTag} callback={this.somethingChanged.bind(this)} eventId={this.state.eventId}/>
                                 <div className="row">
                                    <div className="twelve columns rooms" style={{marginLeft:0}}>
                                       {this.props.event ? this.props.event.rooms.map((room)=><RoomTag removeAlert={this.openRoomAlert} key={room.id} room={room} eventId={this.props.event.id}/>) : ''}
                                    </div>
                                 </div>
                              </div>}
                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="sponsors"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Sponsors</h3>
                              <SponsorTagCreate eventId={this.state.eventId} canCreateTag={this.canCreateTag} callback={this.somethingChanged.bind(this)}/>
                              <div className="row">
                                 <div className="twelve columns tags" style={{marginLeft:0}}>
                                    {this.props.event && this.props.event.sponsortags ? Object.keys(this.props.event.sponsortags).map((tag)=><SponsorTag remove={(tagId)=>{this.openSponsorTag(tagId)}} key={tag} tag={{"id":tag, "label":this.props.event.sponsortags[tag]}} eventId={this.props.event.id}/>) : ''}
                                 </div>
                              </div>

                              <div className="row">
                                 <div className="twelve columns sponsors" style={{marginLeft:0}}>
                                    {this.props.event && this.props.event.sponsor ? Object.keys(this.props.event.sponsor).map((sponsors)=><SponsorList remove={(sponsorId)=>{this.openSponsor(sponsorId)}} nthChange={this.state.nthChange} modalCallback={this.openModal} key={sponsors} tagId={sponsors} tagName={this.props.event.sponsortags[sponsors]} sponsors={this.props.event.sponsor[sponsors]} eventId={this.props.event.id}/>) : ''}
                                 </div>
                              </div>


                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="floorplan"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Floor Plan</h3>
                              <div className="row">
                                 <div className="twelve columns floors">
                                    {this.state.floorplan ? this.state.floorplan.map((floor)=>
                                       <Floor remove={this.floorRemove} nthChange={this.state.nthChange} callback={this.somethingChanged} modalCallback={this.openModal} key={floor.id} floor={floor} eventId={this.state.id}/>) : ''}
                                    <div className="addSponsor" onClick={this.addFloor}>+</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className={classNames('tab',{'active':this.state.activeTab==="advanced"})}>
                        <div className="row mtop50">
                           <div className="twelve columns">
                              <h3>Advanced</h3>
                              <div className="row">
                                 <div className="twelve columns">
                                    <button className="button-red">Delete Event</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  </Loading>
               </div>
            </div>
         </div>

      );
   }

}

const mapStateToProps = (state) => {
   return {
      fetch: state.event,
      event: state.event.event,
      auth: state.auth,
   }
};


const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({...EventActions,...RoomActions}, dispatch)
};

EditEvent.defaultProps = { id: '' };

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent)