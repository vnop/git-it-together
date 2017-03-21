import React from 'react';
import Login from './Login.jsx';
import AuthService from '../config/AuthService.js'
import ProfileEntryView from './ProfileEntryView.jsx'
import {Button} from 'react-bootstrap'
import Nav from './Nav.jsx';
import ProjectList from './ProjectList.jsx';
import Project from './ProjectView.jsx';
import Search from './Search.jsx';
import ChatApp from './chatRoom.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { projects: this.props.projects, currentProject: null, profile: props.auth.getProfile(),  }

    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
    props.auth.on('logged_out', (bye) => {
      this.setState({profile: this.props.auth.getProfile()})
      //this.render();
    })

  }

  handleProjectListEntryClick(project) {
    // setState is async so the render will fire before the currentProject is changed
    // this forces the state to wait until it is updated to rerender
    console.log(project)
    this.state.currentProject = project;
    this.forceUpdate();
  }

  getGitHubProjects(query) {

    var options = {
      key: '',
      query: query
    };

    this.props.searchGitHub()
  }
  logout(){
    this.props.auth.logout()//add props.auth.on('logged-out') event which should be triggered in authservice.js which refreshes page. and same for logged in or authenticated events rather than the use of routes in authservice and here.
    //this.context.router.push('/login');//
  }


  render() {
    const { profile } = this.state
    const { auth } = this.props
    //const requireAuth = (nextState, replace) => {
      if (!auth.loggedIn()) {
       //replace({ pathname: '/login' })
       return (
        <div>
          <Login auth={auth}/>
        </div>
        )
      // }
     } else {
      if (this.state.currentProject === null) {
        return (
          <div>
            <Nav profile={profile} logout={this.logout.bind(this)} handleProjectListEntryClick={this.handleProjectListEntryClick.bind(this)} />
            <Search projects={this.state.projects} handleProjectListEntryClick={this.handleProjectListEntryClick.bind(this)} />
          </div>
        );
      } else {
        return (
          <div>
            <Nav profile={profile} logout={this.logout.bind(this)} handleProjectListEntryClick={this.handleProjectListEntryClick.bind(this)} />
            <Project project={this.state.currentProject} />
          </div>
        );
      }
    }
  }
}

module.exports = App;
