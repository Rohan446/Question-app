const userReducer = (state = {} , action) =>{
    switch(action.type){
        case 'ADD' : return action.payload;
        default : return state;
    }
}
export default userReducer;