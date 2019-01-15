import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import PersonalInformation from '../components/accouontCRUD/PersonalInformation';
import PersonalDescription from '../components/accouontCRUD/PersonalDescription';
import ChangePassword from '../components/accouontCRUD/ChangePassword';
import BoxWithHeader from '../components/items/BoxWithHeader';
import { AuthContext } from '../components/providers/AuthProvider'

const styles = theme => ({
  root: {
    width: 900,
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },

});

class PagePersonalInformations extends React.Component {

  constructor(props) {
    super(props);
    document.title = 'Détails Producteur';

    this.state = {
      //userId: props.match.params.producerId,
    };
  }

  render() {
    const { classes } = this.props;
    const userSettings = (userId, status, token) => (
      <>
        <BoxWithHeader
          header="Informations personnels"
        >
          <PersonalInformation userId={userId} status={status} token={token} />
        </BoxWithHeader>
        <BoxWithHeader
          header="Changer de mot de passe"
        >
          <ChangePassword userId={userId} status={status} token={token} />
        </BoxWithHeader>
      </>
    );

    const producerSettings = (userId, status, token) => (
      <>
        <BoxWithHeader
          header="Informations personnels"
        >
          <PersonalInformation userId={userId} status={status} token={token} />
        </BoxWithHeader>
        <BoxWithHeader
          header="Changer de mot de passe"
        >
          <ChangePassword userId={userId} status={status} token={token} />
        </BoxWithHeader>
        <BoxWithHeader
          header="Changer votre description"
        >
          <PersonalDescription userId={userId} status={status} token={token} />
        </BoxWithHeader>
      </>
    );


    return (
      <div className={classes.root}>
        <AuthContext>
          {({ userId, userStatus, userToken }) => {
            console.info(userId, userStatus, userToken)
            return(userStatus === 'producers' ?
              producerSettings(userId, userStatus, userToken)
            :
              userSettings(userId, userStatus, userToken));
          }
          }
        </AuthContext>


      </div>
    );
  }
}

export default withStyles(styles)(PagePersonalInformations);
