import React from 'react';
import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Workspace from '../Workspace';
import { loginScopes } from './authConfig';
import { useHistory } from 'react-router';
import ErrorLoginComponent from './ErrorLoginComponent';

const WorkspaceAzureWrapper = props => {
  const { user } = useSelector(state => state.auth);

  const history = useHistory();

  useEffect(() => {
    if (!user.id) {
      return history.replace('/');
    }
  }, [user]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginScopes}
      errorComponent={ErrorLoginComponent}
    >
      <Workspace {...props} />
    </MsalAuthenticationTemplate>
  );
};

export default WorkspaceAzureWrapper;
