import React, { Component } from 'react';
import UpdateCourseForm from './UpdateCourseForm';
export default class UpdateCourse extends Component {
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        authorFirstName: '', 
        authorLastName: '',
        errors: [],
    }

    componentDidMount() {             //Called after component is added to fetch the data. 
        const { context } = this.props;
        const { id } = this.props.match.params;

        context.data.getCourse(id)
            .then(data => {
                if (data.status == 404) {
                    this.setState({ errors: [{ message: data.message }] });
                    this.props.history.push('/notfound');
                } else {
                    this.setState({
                        title: data.title,
                        description: data.description,
                        estimatedTime: data.estimatedTime,
                        materialsNeeded: data.materialsNeeded,
                        authorFirstName: data.User.firstName,
                        authorLastName: data.User.lastName,
                        errors: []
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.history.push('/error');
            });
    }

    render() {      //Render using CourseForm
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            authorFirstName,
            authorLastName,
            errors,
        } = this.state;

        return (                   //Return using CourseForm
            <UpdateCourseForm
                cancel={this.cancel}
                errors={errors}
                submit={this.submit}
                submitButtonText="Update Course"
                elements={() => (
                    <React.Fragment>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                    value={title} onChange={this.change} /></div>
                                <p>By {authorFirstName} {authorLastName} </p>
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
        const { id } = this.props.match.params;
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
        const authUser = context.authenticatedUser;   //Auth user message/error validation

        if (authUser == null) {
            this.setState({ errors: [{ message: "You have to be logged in to update a course"}] });
            return;
        }

        context.data.updateCourse(id, course, authUser.username, authUser.password)
            .then(error => {
                if (error.name == 'SequelizeValidationError') {
                    this.setState({ errors: error.errors });
                                } else if (error.status == 403) {
                    this.setState({ errors: [{message: error.message}] })
                    this.props.history.push('/forbidden');
                }
                else {
                    this.setState({ errors: []});
                    this.props.history.push('/');
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.history.push('/error');
            });
    }

    cancel = () => {
        const { id } = this.props.match.params;
        this.props.history.push(`/courses/${id}`);
    }
}