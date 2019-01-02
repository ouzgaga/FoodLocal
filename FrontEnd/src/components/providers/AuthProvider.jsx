import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const {
  Provider: AuthContextProvider,
  Consumer: AuthContext,
} = React.createContext();

class AuthProvider extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      userMail: null,
      userStatus: null,
      isAdmin: false,
      userToken: null,


      error: null,

      signIn: this.signIn,
      signOut: this.signOut,
    };
  }

  componentDidMount(){
    const token = window.localStorage.getItem('token');
    if(token){
      // Récupéréer client.query()
    }
  }

  signIn = ({ userMail, password }) => {
    //const { client } = this.props;
    // TODO: requête user password

    console.info({ userMail, password });

    if (password === '1234') {
      this.setState({
        error: 'Email ou mot de passe invalide.',
      });
    } else {


      const token = '1234567890';
      this.setState({
        userMail: userMail,
        userStatus: 'admin',
        userToken: token,
        error: ''
      });

      window.localStorage.setItem('token', token);
    }
  }

  signOut = () => {
    
  }


  render() {
    const { children } = this.props;

    return (
      <>
        <AuthContextProvider value={this.state}>
          {children}
        </AuthContextProvider>
      </>
    );
  }
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};

export { AuthContext };
export default AuthProvider;
