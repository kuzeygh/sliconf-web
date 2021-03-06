//import events from "../../mock/events";
//import eventfetch from "../../mock/fetchevent";
//import eventCreated from "../../mock/createevent";

const FETCH_EVENT = 'event/FETCH_EVENT';
const FETCH_EVENT_SUCCESS = 'event/FETCH_EVENT_SUCCESS';
const FETCH_EVENT_FAIL = 'event/FETCH_EVENT_FAIL';

/*
const ADD_SPEAKER = 'event/EDIT_EVENT';
const ADD_SPEAKER_SUCCESS = 'event/SAVE_SPEAKER_SUCCESS';
const ADD_SPEAKER_FAIL = 'event/SAVE_SPEAKER_FAIL';
*/

const ADD_EVENT = 'event/EDIT_EVENT';
const ADD_EVENT_SUCCESS = 'event/ADD_EVENT_SUCCESS';
const ADD_EVENT_FAIL = 'event/ADD_SPEAKER_FAIL';

const FETCH_EVENTS = 'event/EDIT_EVENT';
const FETCH_EVENTS_SUCCESS = 'event/FETCH_EVENTS_SUCCESS';
const FETCH_EVENTS_FAIL = 'event/FETCH_EVENTS_FAIL';

const FETCH_ROOMS = 'event/EDIT_EVENT';
const FETCH_ROOMS_SUCCESS = 'event/FETCH_ROOMS_SUCCESS';
const FETCH_ROOMS_FAIL = 'event/FETCH_ROOMS_FAIL';

const REMOVE_ROOM_FROM_LOCAL = 'event/REMOVE_ROOM_FROM_LOCAL';
const EDIT_ROOM_FROM_LOCAL = 'event/EDIT_ROOM_FROM_LOCAL';
const MOVE_ROOM_FROM_LOCAL = 'event/MOVE_ROOM_FROM_LOCAL';
const ADD_ROOM_TO_LOCAL = 'event/ADD_ROOM_TO_LOCAL';

const REMOVE_TAG_FROM_LOCAL = 'event/REMOVE_TAG_FROM_LOCAL';
const ADD_TAG_TO_LOCAL = 'event/ADD_TAG_TO_LOCAL';

const REMOVE_SPONSOR_FROM_LOCAL = 'event/REMOVE_SPONSOR_FROM_LOCAL';
const EDIT_SPONSOR_FROM_LOCAL = 'event/EDIT_SPONSOR_FROM_LOCAL';
const ADD_SPONSOR_TO_LOCAL = 'event/ADD_SPONSOR_TO_LOCAL';

const REMOVE_FLOOR_FROM_LOCAL = 'event/REMOVE_FLOOR_FROM_LOCAL';
const EDIT_FLOOR_FROM_LOCAL = 'event/EDIT_FLOOR_FROM_LOCAL';
const ADD_FLOOR_TO_LOCAL = 'event/ADD_FLOOR_TO_LOCAL';

const EDIT_EVENT = 'event/EDIT_EVENT';
const EDIT_EVENT_SUCCESS = 'event/EDIT_EVENT_SUCCESS';
const EDIT_EVENT_FAIL = 'event/FETCH_EVENT_FAIL';

const DELETE_EVENT = 'event/EDIT_EVENT';
const DELETE_EVENT_SUCCESS = 'event/DELETE_EVENT_SUCCESS';
const DELETE_EVENT_FAIL = 'event/FETCH_EVENT_FAIL';

const EDIT_TAB = 'event/EDIT_EVENT';
const EDIT_TAB_SUCCESS = 'event/EDIT_TAB_SUCCESS';
const EDIT_TAB_FAIL = 'event/FETCH_EVENT_FAIL';

const GET_STATICS = 'event/GET_STATICS';
const GET_STATICS_SUCCESS = 'event/GET_STATICS_SUCCESS';
const GET_STATICS_FAIL = 'event/GET_STATICS_FAIL';



const initialState = {
   loading: false,
   event: null,
   events: []
};

export default function reducer(state = initialState, action = {}) {
   switch (action.type) {
      // event
      case FETCH_EVENT:
         return {
            ...state,
            removed:false,
            loading: true
         };
      case FETCH_EVENT_SUCCESS:
         //console.log(action.result)
         const fillTheBlanks = action.result.returnObject;
         fillTheBlanks.about = fillTheBlanks.about ? fillTheBlanks.about : {};
         fillTheBlanks.rooms = fillTheBlanks.rooms ? fillTheBlanks.rooms : [];
         fillTheBlanks.agenda = fillTheBlanks.agenda ? fillTheBlanks.agenda : [];
         fillTheBlanks.speakers = fillTheBlanks.speakers ? fillTheBlanks.speakers : [];
         fillTheBlanks.floorPlan = fillTheBlanks.floorPlan ? fillTheBlanks.floorPlan : [];
         fillTheBlanks.sponsorTags = fillTheBlanks.sponsorTags ? fillTheBlanks.sponsorTags : {};
         fillTheBlanks.sponsors = fillTheBlanks.sponsors ? fillTheBlanks.sponsors : {};
         fillTheBlanks.requestStatus = true;
         return {
            ...state,
            loading: false,
            removed:false,
            event: fillTheBlanks,
            status: action.result.status,
            saveStatus: true,
            error: null
         };
      case FETCH_EVENT_FAIL:
         return {
            ...state,
            loading: false,
            event: null,
            error: action.error
         };
      case EDIT_EVENT:
         return {
            ...state,
            loading: true
         };
      case EDIT_EVENT_SUCCESS:
         const fillTheBlanks2 = action.result.returnObject;
         fillTheBlanks2.about = fillTheBlanks2.about ? fillTheBlanks2.about : {};
         fillTheBlanks2.rooms = fillTheBlanks2.rooms ? fillTheBlanks2.rooms : [];
         fillTheBlanks2.agenda = fillTheBlanks2.agenda ? fillTheBlanks2.agenda : [];
         fillTheBlanks2.speakers = fillTheBlanks2.speakers ? fillTheBlanks2.speakers : [];
         fillTheBlanks2.floorPlan = fillTheBlanks2.floorPlan ? fillTheBlanks2.floorPlan : [];
         fillTheBlanks2.sponsorTags = fillTheBlanks2.sponsorTags ? fillTheBlanks2.sponsorTags : {};
         fillTheBlanks2.sponsors = fillTheBlanks2.sponsors ? fillTheBlanks2.sponsors : {};
         return {
            ...state,
            loading: false,
            event: fillTheBlanks2,
            saveStatus:action.result.status,
            error: null
         };
      case DELETE_EVENT_SUCCESS:
         return {
            ...state,
            event: null,
            removed:true,
            error: null
         };
      case EDIT_TAB_SUCCESS:
         //console.log(state);
         let fillTheBlanks3 = action.result.returnObject;
         let floorMerge = Object.assign({}, state.event, {returnMessage:action.result.message,fillTheBlanks3});
         if(action.result.message === "Floor saved successfully"){
            floorMerge = Object.assign({}, state.event, {returnMessage:action.result.message,floorPlan:fillTheBlanks3});
         }

         //console.log("yeni",fillTheBlanks3)
         //console.log(state.event);
         return {
            ...state,
            loading: false,
            event: {...floorMerge, noGeneral:true},
            error: null
         };
      // events
      case FETCH_EVENTS_SUCCESS:
         return {
            ...state,
            loading: false,
            active: action.result.returnObject.active,
            passive: action.result.returnObject.passive,
         };
      case FETCH_EVENTS_FAIL:
         return {
            ...state,
            loading: false,
            events: [],
            error: action.error
         };
      // rooms
      case FETCH_ROOMS_SUCCESS:
         return {
            ...state,
            loading: false,
            rooms: action.result.returnObject,
         };
      case FETCH_ROOMS_FAIL:
         return {
            ...state,
            loading: false,
            rooms: [],
            error: action.error
         };
      // add speaker to event
      /*
      case ADD_SPEAKER_SUCCESS:
         return {
            ...state,
            loading: false,
            speakerSuccess:true,
            error: null
         };
      case ADD_SPEAKER_FAIL:
         return {
            ...state,
            loading: false,
            error: action.error
         };
      */
      // add event to system
      case ADD_EVENT_SUCCESS:
         return {
            ...state,
            creation: action.result.returnObject,
            loading: false,
            error: null,
            status:action.result.status,
            message:action.result.message,
         };
      case REMOVE_ROOM_FROM_LOCAL:
         return {
            ...state,
            event:{...state.event,rooms:[...state.event.rooms.filter(room=>room.id!==action.roomId)]}
         };
      case MOVE_ROOM_FROM_LOCAL:
            let where = action.swipeType==="left" ? -1 : action.swipeType==="right" ? +1 : 0;
            let n = state.event.rooms.findIndex((room => room.id === action.roomId));
            console.log("movin", n, "to", n+where);
            let cloneRooms = state.event.rooms.slice(0);
            if(cloneRooms[n+where]){
                  let b = cloneRooms[n];
                  cloneRooms[n] = cloneRooms[n+where];
                  cloneRooms[n+where] = b;
            }
            return {
                  ...state,
                  event:{...state.event,rooms:[...cloneRooms]}
            };
      case EDIT_ROOM_FROM_LOCAL:
            let i = state.event.rooms.findIndex((room => room.id === action.roomId));
            state.event.rooms[i].label = action.roomLabel;
            state.event.rooms[i].floor = action.roomFloor;
            console.log(state.event.rooms);
            return {
            ...state,
            event:{...state.event,rooms:state.event.rooms}
         };
      case ADD_ROOM_TO_LOCAL:
         return {
            ...state,
            event:{...state.event,rooms:[...state.event.rooms,action.room]}
         };
      case REMOVE_TAG_FROM_LOCAL:
         const filtereds = Object.keys(state.event.sponsors).filter(key => !action.tagId.includes(key)).reduce((obj, key) => {obj[key] = state.event.sponsors[key];return obj}, {});
         const filtered = Object.keys(state.event.sponsorTags).filter(key => !action.tagId.includes(key)).reduce((obj, key) => {obj[key] = state.event.sponsorTags[key];return obj}, {});
         return {
            ...state,
            event:{...state.event,sponsorTags:filtered,sponsors:filtereds}
         };
      case ADD_TAG_TO_LOCAL:
         const uniqueTagId = action.tag.id;
         return {
            ...state,
            event:{...state.event,sponsorTags:{...state.event.sponsorTags,[uniqueTagId]:action.tag.label},sponsors:{...state.event.sponsors,[uniqueTagId]:[]}}
         };
      case REMOVE_SPONSOR_FROM_LOCAL:
         const ses = state.event.sponsors;
         Object.keys(ses).filter(key => ses[key].filter(key2 =>{if(action.sponsorId.includes(key2.id)){ses[key] = ses[key].filter(function(el){return el.id !== key2.id;});return false;}return false;}));
         return {
            ...state,
            event:{...state.event,sponsors:ses}
         };
      case EDIT_SPONSOR_FROM_LOCAL:
         const ses2 = state.event.sponsors;
         Object.keys(ses2).filter(key => ses2[key].filter(key2 =>{if(action.sponsorId.includes(key2.id)){ses2[key] = ses2[key].filter(function(el){
            if(el.id === key2.id){el.name = action.name;el.logo = action.logo;}
            return true;
         });}return false;}));
         return {
            ...state,
            event:{...state.event,sponsors:ses2}
         };
      case ADD_SPONSOR_TO_LOCAL:
         const ses3 = state.event.sponsors;
         ses3[action.tagId].push({
            id:'newid'+action.nthNew,
            logo:action.sponsorImage,
            name:action.sponsorName,
         });
         return {
            ...state,
            event:{...state.event,sponsors:ses3}
         };
      case REMOVE_FLOOR_FROM_LOCAL:
         console.log(state);
         const ses4 = state.event.floorPlan.filter(function(el){return el.id !== action.floor;});
         const ses7 = state.event.rooms.filter(function(el){return el.floor !== action.floor;});
         return {
            ...state,
            event:{...state.event,floorPlan:ses4, rooms:ses7}
         };
      case EDIT_FLOOR_FROM_LOCAL:
         const ses5 = state.event.floorPlan.filter(function(el){
            if(el.id === action.floor){
               el.name = action.name;
               el.image = action.image;
            }
            return true;
         });
         return {
            ...state,
            event:{...state.event,floorPlan:ses5}
         };
      case ADD_FLOOR_TO_LOCAL:
         const ses6 = state.event.floorPlan;
         ses6.push({
            id:'newid'+action.nthNew,
            image:action.floorImage,
            name:action.floorName,
         });
         return {
            ...state,
            event:{...state.event,floorPlan:ses6}
         };
      case GET_STATICS:
         return {
            ...state,
            error:false,
            loading: true
         };
      case GET_STATICS_SUCCESS:
         return {
            ...state,
            loading: false,
            statics: action.result.returnObject,
            status: action.result.status,
            error: null
         };
      case GET_STATICS_FAIL:
         return {
            ...state,
            loading: false,
            statics: null,
            error: action.error
         };
      default:
         return state;
   }
}

export function fetchEvent(eventId) {
   //console.log(eventId);
   return {
      types: [FETCH_EVENT, FETCH_EVENT_SUCCESS, FETCH_EVENT_FAIL],
      promise: (client) => client.get('/events/get/with-key/'+eventId)
   }
}

export function createEvent(userId, name, date, endDate) {
   return {
      types: [ADD_EVENT, ADD_EVENT_SUCCESS, ADD_EVENT_FAIL],
      promise: (client) => client.post('/events/create/'+userId,{
         data: {userId, name, "startDate":date, "endDate":endDate}
      })
   }
}
/*
export function addSpeaker(eventId,speaker) {
   return {
      types: [ADD_SPEAKER, ADD_SPEAKER_SUCCESS, ADD_SPEAKER_FAIL],
      promise: (client) => client.post('/events/'+eventId,{
         data: speaker
      })
   }
}
*/
export function fetchEvents(userId) {
   return {
      types: [FETCH_EVENTS, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAIL],
      promise: (client) => client.get('/events/list/'+userId)
   }
}

export function fetchRooms(eventId) {
   return {
      types: [FETCH_ROOMS, FETCH_ROOMS_SUCCESS, FETCH_ROOMS_FAIL],
      promise: (client) => client.get('/events/rooms/'+eventId)
   }
}

export function getStatics(eventId) {
   return {
      types: [GET_STATICS, GET_STATICS_SUCCESS, GET_STATICS_FAIL],
      promise: (client) => client.get('/events/get/statistics/'+eventId)
   }
}

export function getVotes(eventId) {
   return {
      types: [GET_STATICS, GET_STATICS_SUCCESS, GET_STATICS_FAIL],
      promise: (client) => client.get('/events/'+eventId+'/statistics/sessions')
   }
}


export function removeRoomFromLocal(roomId) {
   return {
      type: REMOVE_ROOM_FROM_LOCAL,
      roomId
   }
}

export function editRoomFromLocal(roomId, roomLabel, roomFloor) {
      return {
         type: EDIT_ROOM_FROM_LOCAL,
         roomId, roomLabel, roomFloor
      }
}

export function moveRoomFromLocal(roomId, swipeType) {
      console.log(roomId, swipeType);
      return {
         type: MOVE_ROOM_FROM_LOCAL,
         roomId, swipeType
      }
}

export function addRoomToLocal(room) {
   return {
      type: ADD_ROOM_TO_LOCAL,
      room
   }
}

export function removeTagFromLocal(tagId) {
   return {
      type: REMOVE_TAG_FROM_LOCAL,
      tagId
   }
}

export function addTagToLocal(tag) {
   return {
      type: ADD_TAG_TO_LOCAL,
      tag
   }
}

/*
export function removeSponsorFromLocal(sponsorId) {
   return {
      type: REMOVE_SPONSOR_FROM_LOCAL,
      sponsorId
   }
}

export function editSponsorFromLocal(sponsorId, name, logo) {
   return {
      type: EDIT_SPONSOR_FROM_LOCAL,
      sponsorId,name,logo
   }
}

export function addSponsorToLocal(sponsorName, sponsorImage, tagId, nthNew) {
   return {
      type: ADD_SPONSOR_TO_LOCAL,
      sponsorName,sponsorImage,tagId,nthNew
   }
}

*/
export function removeFloorFromLocal(floor) {
   return {
      type: REMOVE_FLOOR_FROM_LOCAL,
      floor
   }
}
//sasasasa

export function editFloorFromLocal(floor, name, image) {
   return {
      type: EDIT_FLOOR_FROM_LOCAL,
      floor,name,image
   }
}

export function addFloorToLocal(floorName, floorImage, nthNew) {
   return {
      type: ADD_FLOOR_TO_LOCAL,
      floorName,floorImage,nthNew
   }
}

export function editEvent(userId,eventData) {
   return {
      types: [EDIT_EVENT, EDIT_EVENT_SUCCESS, EDIT_EVENT_FAIL],
      promise: (client) => client.post('/events/create/'+userId,{
         data: eventData
      })
   }
}

export function deleteEvent(eventId,userId) {
   return {
      types: [DELETE_EVENT, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAIL],
      promise: (client) => client.del('/events/delete/'+eventId+"/"+userId)
   }
}

export function editTab(tab,eventKey,eventData) {
   let ne = tab==="sponsors" ? "sponsor" : tab==="rooms" ? "room" : tab==="floorplan" ? "floor" : "no";
   if(ne!=="no"){
      return {
         types: [EDIT_TAB, EDIT_TAB_SUCCESS, EDIT_TAB_FAIL],
         promise: (client) => client.post('/events/'+ne+'/create/'+eventKey,{
            data: eventData
         })
      }
   }
}