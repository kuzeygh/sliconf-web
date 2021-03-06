const NEXT_STEP = 'silly/NEXT_STEP';

const initialState = {
   loading: false,
   step:-1,
   tab:"",
   completed:false,
   lastStep:-1,
};

export default function reducer(state = initialState, action = {}) {
   switch (action.type) {
      case NEXT_STEP:
         if(state.step!==-2 || action.tab==="userOpen"){
            return {
               ...state,
               step:action.step,
               tab:action.tab,
               completed:action.completed,
               lastStep:action.step!==-2 && action.step!==0 ? action.step : state.lastStep,
               callback:action.callback,
            };
         }else if(state.step===-2 && action.step!==-2){
            return {
               ...state,
               step:-2,
               tab:action.tab,
               completed:action.completed,
               lastStep:action.step,
               callback:action.callback,
            };
         }else{
            return state;
         }
      default:
         return state;
   }
}

export function changeStep(step, tab="", completed=false, callback=()=>{}) {
   return {
      type: NEXT_STEP,
      step,tab,completed,callback
   }
}