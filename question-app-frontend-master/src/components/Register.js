import React from 'react';
import '../componentsStyle/LoginRegister.css';
import { Link,Redirect } from 'react-router-dom'; 
import {connect} from 'react-redux';

class Register extends React.Component {
    state={
        firstName:"",
        lastName:"",
        useremail : "",
        password : "",
        firstNameInput :false,
        emailInput: false,
        passwordInput : false,
        displayText:'',
        loading:false
    }

    registerButton = () => {
        if(!this.state.firstName){
            this.setState({firstNameInput :true});
            this.setState({displayText:'First Name Cannot be empty!'});
        }
        else if(!this.state.useremail){
            this.setState({emailInput:true});
            this.setState({displayText:'Email Id Cannot be empty!'});
        }
        else if(!this.state.password){
            this.setState({passwordInput:true});
            this.setState({displayText:'Password Cannot be empty !'});
        }
        else if(!this.validateEmail(this.state.useremail)){
            this.setState({emailInput:true});
            this.setState({displayText:'Email Id is not proper!'});
        }
        else if(this.state.password.length < 8){
            this.setState({passwordInput:true});
            this.setState({displayText:'Password should be atleast 8 characters!'});
        }
        else{
            this.registerUser();
        }
    }

    checkSession(value){
        return value ?   <Redirect to="/questions"/> : ""
      }

    registerUser(){
        this.setState({loading:true});
        let userObj = {
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            emailId:this.state.useremail,
            password:this.state.password
        }

        let headders = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(userObj)
        }

        fetch("https://quiet-shelf-71244.herokuapp.com/register",headders)
        .then(res => res.json())
        .then(res => {
            this.setState({loading:false});
            if(res.response){
                this.setState({displayText:'SuccessFully registers now confirm you mail to login, Check Inbox'});
            }
            else{
                this.setState({displayText:res.message});
            }
        })
    }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    changeFirstName(e){
       this.changeWarningSign();
       this.setState({firstName:e.target.value});
    }
    
    changeLastName(e){
        this.changeWarningSign();
        this.setState({lastName:e.target.value});
     }

    changeEmail(e){
        this.changeWarningSign();
        this.setState({useremail:e.target.value});
     }

    changePassword(e){
        this.changeWarningSign();
        this.setState({password:e.target.value});
    }

    changeWarningSign(){
        if(this.state.firstNameInput){
            this.setState({firstNameInput:false});
        }
        if(this.state.emailInput){
            this.setState({emailInput:false});
        }
        if(this.state.passwordInput){
            this.setState({passwordInput:false});
        }
        this.setState({displayText:''})
    }

    displayText(){
        return <p></p>
    }

    render(){
        const  emailStyle = { border: this.state.emailInput ? 'solid' : 'none' , borderColor: this.state.emailInput ? 'red' : '' };
        const passwordStyle = { border: this.state.passwordInput ? 'solid' : 'none', borderColor: this.state.passwordInput ? 'red' : '' };
        const firstNameStyle = { border: this.state.firstNameInput ? 'solid' : 'none' , borderColor: this.state.firstNameInput ? 'red' : '' };
        const loadingStyle = {display : this.state.loading ? '':'none', height:'40px'}

        return(
            <div className="loginMainContaier">
                {this.checkSession(this.props.loggedIn)}
                <div className="loginContainer">
                    <span id="topMargin"></span>
                    <p style={{color:'white',fontSize:'20px',fontFamily:'sans-serif'}}>REGISTER</p>
                    <input style={firstNameStyle} id="inputText" placeholder="First Name" type="text" onInput={e => this.changeFirstName(e)}/>
                    <input id="inputText" placeholder="Last Name" type="text" onInput={e => this.changeLastName(e)}/>
                    <input style={emailStyle} id="inputText" placeholder="Email" type="text" onInput={e => this.changeEmail(e)}/>
                    <input style={passwordStyle} id="inputText" placeholder="Password" type="password" onChange={e => this.changePassword(e)}/>
                    <br></br>
                    <button id="inButton" onClick={this.registerButton}>Register</button>
                    <p style={{color:'white'}}>Aldready Have an Account ?  <Link to="/login" style={{color:'white'}}>Login here</Link></p>
                    <p style={{color:'white'}}>{this.state.displayText}</p>
                    <img src="https://i.ya-webdesign.com/images/loading-png-gif.gif" 
                        style={loadingStyle}
                    />
                </div>
            </div>
        )
    }
}

function mapState(state){
    return {
      loggedIn : state.login,
      user : state.user
    }
  }

export default connect(mapState)(Register);
