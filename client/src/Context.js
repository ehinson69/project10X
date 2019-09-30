import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {    //authUser return with cookie or return null
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    // authenticatedUser: Cookies.getJSON('userPassword') || null

  };

  constructor() {
    super();
    this.data = new Data();    //Data object for access
  }

  render() {     
    const { authenticatedUser } = this.state;
    // const { userPassword } = this.state;

    const value = {     //look for Value of AuthUser
      authenticatedUser,
      // userPassword,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };
    return (         //Return context value/children
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }
  
  signIn = async (emailAddress, password) => {   //Signin function
    const user = await this.data.getUser(emailAddress, password);  //Data from Data.js
    user.password = password;

    if (user !== null) {    //If user is not null, return state of authUser
      this.setState(() => {
        return {
          authenticatedUser: user,
          // userPassword: password
        };
      });
     
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      // Cookies.set('userPassword', JSON.stringify(user), { expires: 1 });

    }
    return user;    //Return user signin
  }

  signOut = () => {   //SignOut function
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
    console.log('contextSignoutReached');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
