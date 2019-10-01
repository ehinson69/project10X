import React, { Component } from "react"; //Imports added
import axios from "axios";
import { Link } from "react-router-dom";
import ReactMarkDown from "react-markdown";
export default class CourseDetail extends Component {
  //Stateless component function
  constructor() {
    super();
    this.state = {
      data: null,
      errors: []
    };
  }

  componentDidMount() {
    //Component mount, getting data from url
    const { id } = this.props.match.params;

    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then(response => {
        this.setState({
          data: response.data
        });
      })
      .catch(error => {
        console.log("Error fetching data", error);
        if (error === "Error: Request failed with status code 404") {
          this.props.history.push("/notfound");
        } else {
          this.props.history.push("/error");
        }
      });
  }

  delete = () => {
    //Delete course if authenticated user
    const { context } = this.props;
    const { id } = this.props.match.params;
    const authUser = context.authenticatedUser;

    if (authUser == null) {
      this.setState({
        errors: [{ message: "You have to be logged in to update a course" }]
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this course?")) {
      context.data
        .deleteCourse(id, authUser.emailAddress, authUser.password)
        .then(error => {
          console.log("Error: ");
          console.log(error);
          if (
            error.status === 401 ||
            error.status === 403 ||
            error.status === 404
          ) {
            this.setState({ errors: [{ message: error.error }] });
          } else {
            this.setState({ errors: [] });
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log(err);
          this.props.history.push("/error");
        });
    }
  };

  render() {
    //Render data & auth user can update or delete course
    let course = {};
    let user = {};
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    if (this.state.data) {
      course = this.state.data;
      user = this.state.data.User;
    }
    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {authUser && authUser.id === user.id ? ( //Restricting user tenarary
                <span>
                  <Link className="button" to={`/courses/${course.id}/update/`}>
                    Update Course
                  </Link>
                  <Link onClick={this.delete} className="button" to="#">
                    Delete Course
                  </Link>
                </span>
              ) : null}
              <Link className="button button-secondary" to="/">
                Return to List
              </Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <ErrorsDisplay errors={this.state.errors} />
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>
                By {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="course--description">
              <ReactMarkDown source={course.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{course.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <ReactMarkDown source={course.materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function ErrorsDisplay({ errors }) {
  //Display/validate errors & React Markdown added above
  let errorsDisplay = null;

  if (errors.length) {
    errorsDisplay = (
      <div>
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return errorsDisplay;
}
