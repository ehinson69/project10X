import config from './config';

export default class Data {   //Class usses fetch for functions to use API
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;        //Link referencing config
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',  
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
  async getCourse(id) {         //Added to get course
    const response = await this.api(`/courses/${id}`);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 404) {
      return response.json().then(data => {
        return data.error;
    });
  }
    else {
      throw new Error();
    }
  }
  
  async updateCourse(id, course, username, password) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, {username, password});
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403 || response.status ===400) {
      return response.json().then(data => {
        return data.error;
    });
  }
    else {
      throw new Error();
    }
  }

  async createCourse(course, username, password) {    //added createCourse
    const response = await this.api('/courses', 'POST', course, true, {username, password} );
    
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.error.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async deleteCourse(id, username, password) {   //Sending ID to the API
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {username, password} );
    
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403 || response.status === 404) {
      return response.json().then(data => {
        return data.error;
      });
    }
    else {
      throw new Error();
    }
  } 
}