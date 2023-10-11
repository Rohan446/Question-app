import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faGamepad, faAngleDoubleRight, faBars, faCheck, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../componentsStyle/Questions.css'
import SettingsPage from './SettingsPage';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class Questions extends React.Component {
    state = {
        questions: [],
        isGamePad: true,
        sideBarToggle:false,
        isLoding : false,
        showSubmitButton:false,
        answers:{},
        radioToggleIds:{},
        questionId : [],
        isSubmitted : false
    }


    checkSession(value){
        return value ?  "" : <Redirect to="/login"/>
      }

    componentDidMount() {
        if(!this.state.isGamePad)
            alert("Please move to questions view to reload");
        else{
        this.setState({isLoding:true,showSubmitButto:false,questions:[],isSubmitted:false,answers:{}});
        fetch("https://quiet-shelf-71244.herokuapp.com/questions")
            .then(res => res.json())
            .then(res => {
                console.log(JSON.stringify(res));
                this.setState({ questions: res.datas });
                this.setState({isLoding:false, showSubmitButton:true});
            })
            .catch(e => console.log(e));
        }
    }

    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    checkAnswers(){
        console.log("into checkAnswer");
        console.log(this.state.answers)
        //this.setState({questionId:["Question_103","Question_104","Question_105"],isSubmitted:true});
        if(this.isEmpty(this.state.answers))
            alert("Please Answer questions before submit");
        else if(Object.keys(this.state.answers).length < 5)
            alert("Please answer all the questions before submitting");
        else{this.fetchAndCheckAnswers()}
    }

    fetchAndCheckAnswers(){
        let headders = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(this.state.answers)
        }

        fetch("https://quiet-shelf-71244.herokuapp.com//questions/verify",headders)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            this.setState({isSubmitted:true});
            Object.keys(res.data).map(key => {
                if(res.data[key])
                    this.setState({questionId:[...this.state.questionId,key]});
            });
            console.log(this.state.questionId);
        })
        .catch(e => console.log(e));
    }

    gamePadClickHandler() {
        this.setState({ isGamePad : true,showSubmitButton:true});
    }

    settingsHandler() {
        this.setState({ isGamePad : false, showSubmitButton:false });
    }

    sideToggle =  () => {
        this.setState({sideBarToggle:!this.state.sideBarToggle});
    }

    checkSession(){
        console.log(this.props.loggedIn);
        return this.props.loggedIn ? '' : <Redirect to="/"/>
    }

    render() {
        const submiButton = this.state.showSubmitButton ? {display:''} : {display:'none'}
        const iconStyle = { fontSize: '40px', color: '#af97d4', marginTop: '30px' }
        return (
            <div className="mainQuestionsContainer">
                {this.checkSession()}
                <div className="navBar">
                    <div className="sideBarSelector" onClick={this.sideToggle}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <p style={{ fontSize: '20px', marginLeft: '40px', padding: '8px' }}>Questions</p>
                    <div className="syncIcon" onClick={() => this.componentDidMount()}>
                        <FontAwesomeIcon icon={faSyncAlt}/>
                    </div>
                </div>
                <div className="sideBar" style={this.state.sideBarToggle ? {marginLeft:'0px'}: {}}>
                    <div className="iconDisplay">
                        <FontAwesomeIcon icon={faGamepad} style={iconStyle} onClick={() => this.gamePadClickHandler()} />
                    </div>
                    <div className="iconDisplay">
                        <FontAwesomeIcon icon={faCog} style={iconStyle} onClick={() => this.settingsHandler()} />
                    </div>
                </div>
                <div className="mainContainer">
                    <div className="loadingImage" style={this.state.isLoding ?{display:'block'} : {display:'none'}}><img id="imageGIF" alt='' src="https://animaloilmaker.com/images/gif-red-loading-4.gif"></img></div>
                    {this.state.isGamePad ? this.getQuestionContainer() : this.getSettingsContainer()}
                    <button className="ansWerButton" style={submiButton} onClick={() => this.checkAnswers()}>Submit</button>
                </div>
            </div>
        )
    }

    getSettingsContainer() {
        return <div className="settingsContainer">
                <SettingsPage></SettingsPage>
        </div>
    }

    onValueChange(event) {
        let id = event.target.id;
        let answer = event.target.value;
        console.log(id+","+answer);
        this.setState({answers:{...this.state.answers,[id]:answer}, radioToggleIds:{id:answer}});
        console.log(this.state.answers);
      }

getQuestionContainer() {
        return (<div className="questionsHolder">
            <div className="questionsLifter" style={{marginTop:"80px"}}>
            {this.state.questions.map(e => this.getEachQuestion(e))}
            </div>
        </div>);
    }

    getEachQuestion(obj) {
        let tickStyle =  this.state.isSubmitted ? {display:'block'} : {display:'none'};

        return (
            <div key={obj.questionId} className="questionsContainer">
                <span className="question"><FontAwesomeIcon icon={faAngleDoubleRight} />  {obj.question}</span>
                <div className="choiseContainer">
                    {obj.choice.map(e => {
                        return <div className="choise">
                               <input type="radio" id={obj.questionId} value={e} checked={this.state.answers[obj.questionId] == e} onChange={(e)=> this.onValueChange(e)}></input>
                            <label>{e}</label>
                        </div>
                    })}
                </div>
                <div>
                    {this.state.questionId.includes(obj.questionId) ?
                    <span className="rightAnswer" style={tickStyle}>Answer : <FontAwesomeIcon icon={faCheck}/></span>
                    : <span className="wrongAnswer" style={tickStyle}>Answer : <FontAwesomeIcon icon={faTimes}/></span>}
                </div>
            </div>
        );
    }
}

function mapState(state){
    return {
      loggedIn : state.login,
      user : state.user
    }
  }
export default connect(mapState)(Questions);