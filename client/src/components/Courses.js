import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default class Courses extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        };
    }

    componentDidMount() {//Get api courses when mounted
        axios.get('http://localhost:5000/api/courses')
            .then(response => {
                this.setState({
                    data: response.data
                });
            })
            .catch(error => {
                console.log('Error fetching data', error);
                if (error == 'Error: Request failed with status code 500') {
                window.location.href = '/error';
                }
            });
    }

    render() {//Render HTML data
        let dataHtml = this.state.data.map(dataItem =>
            <div className="grid-33"> <Link className="course--module course--link" to={`/courses/${dataItem.id}`} >
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{dataItem.title}</h3>
            </Link></div>
        );
        return (
            <div className="bounds">
                {dataHtml}
                <div className="grid-33"><Link className="course--module course--add--module" to="/courses/create">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </Link></div>
            </div>
        );
    }
}