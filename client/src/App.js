import React, { Component }  from 'react';         //Imports for all routes used
import './App.css';


import {
    BrowserRouter as Router,      //BrowerRouter/Switch
    Route,
    Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';                //HOC import
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import UnhandledError from './components/UnhandledError';

const HeaderWithContext = withContext(Header);               //Defining routes being used
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);


export default class App extends Component {               //Stateless component function

    constructor() {
        super();
    }

    componentDidMount() {  //Called after component to get data

    }

    render() {
        
        return (            //Routes set up for each task, private route for authentication, create & update courses
            <Router>  
                <div>
                    <HeaderWithContext />

                    <Switch>
                        <Route exact path="/" component={Courses} />
                        <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
                        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
                        <Route path="/signin" component={UserSignInWithContext} />
                        <Route path="/signup" component={UserSignUpWithContext} />
                        <Route path="/signout" component={UserSignOutWithContext} />
                        <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
                        <Route path="/forbidden" component={Forbidden} />
                        <Route path="/error" component={UnhandledError} />
                        <Route path="/notfound" component={NotFound} /> 
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        );
    }
}


//*****EXTRA CREDIT FEATURES ADDED-NotFound, UnhandledError, Foridded. Added path components
//for these routes as we... Course Detail and Update Course components are redirected to 
//NotFound & Update course component redirected to Forbidden path. Finally, I've redirected to the 
//Error path 500 to the RES API return.******//