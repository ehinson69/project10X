import React, { Component } from 'react';
import CourseForm from './CourseForm';
export default class CreateCourse extends Component {
    state = {//Init state for Create Course 
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: [],
    }

    render() {
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
        } = this.state;

        const { context } = this.props;
        const authUser = context.authenticatedUser;

        return (//Return using CourseForm to Create Course
                 <CourseForm
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
                    elements={() => (
                        <React.Fragment>
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                        value={title} onChange={this.change} /></div>
                                        <p>By {authUser.name} </p>
                                </div>
                                <div className="course--description">
                                    <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.change} value={description} ></textarea></div>
                                </div>
                            </div>
                            <div className="grid-25 grid-right">
                                <div className="course--stats">
                                    <ul className="course--stats--list">
                                        <li className="course--stats--list--item">
                                            <h4>Estimated Time</h4>
                                            <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                                placeholder="Hours" value={estimatedTime} onChange={this.change} /></div>
                                        </li>
                                        <li className="course--stats--list--item">
                                            <h4>Materials Needed</h4>
                                            <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.change} value={materialsNeeded} ></textarea></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                                
                         </React.Fragment>
                    )} />
                   
        );
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    submit = () => {
        const { context } = this.props;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;
            
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        };
                 //Auth useer from context & validate errors
        const authUser = context.authenticatedUser;

        if (authUser == null) {
            this.setState({ errors: [{message: "You have to be logged in to create a course"}] });
            return;
        }

        context.data.createCourse(course, authUser.username, authUser.password)
            .then(errors => {

                if (errors.length) {
                    this.setState({ errors: errors });
                } else {
                    this.setState({ errors: [] });
                   
                    this.props.history.push('/');
                       
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.history.push('/error');
            });

    }

    cancel = () => {
        this.props.history.push('/');
    }
}