import React from 'react';
import { Redirect } from 'react-router-dom';
import '../componentsStyle/Questions.css';
import {connect} from 'react-redux'
import { login } from '../actions/actions';

class SettingsPage extends React.Component{
    state={
        user : {},
        isLogout:false
    }

    logout(){
        fetch("https://quiet-shelf-71244.herokuapp.com/session/logout")
        .then(() => {
            this.setState({isLogout:true})
            this.props.dispatch(login(false));
        })
    }

    renderRedirect(){
        return this.state.isLogout ? <Redirect to="/login"/> : '';
    }


    render(){
        return(
            <div style={{marginTop:'100px'}}>
                 {this.renderRedirect()}
                <p style={{fontSize:'25px'}}>App : Questions App</p>
                 <button className="ansWerButton" onClick={()=>this.logout()}>Logout</button>
            </div>
        )
    }
}

export default connect()(SettingsPage);