/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { Redirect } from 'react-router';
import { apiScopes, loginScopes, msGraphMeEndpoint } from './authConfig';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStateWithAzure } from '../../features/auth/actions';
import ErrorLoginComponent from './ErrorLoginComponent';
import _ from 'lodash';
import { Box, CircularProgress } from '@material-ui/core';
import { callApiWithToken } from '../../utils/auth';

const { REACT_APP_AZURE_REDIRECT_URI } = process.env;

function AzureLoginPage() {
  /* useMsal is hook that returns the PublicClientApplication instance */
  const { instance, accounts, inProgress } = useMsal();
  const account = accounts[0] || null;

  const dispatch = useDispatch();
  const [authError, user] = useSelector(state => [state.auth.errorObj, state.auth.user]);

  const silentTokenOptions = {
    ...loginScopes,
    account: account,
    redirectUri: REACT_APP_AZURE_REDIRECT_URI + '/auth.html',
  };

  useEffect(() => {
    if (account && inProgress === 'none') {
      /* set account to Active for Axios interceptor to send HTTPS with fresh tokens */
      instance.setActiveAccount(account);
      (async () => {
        //Aquire fresh tokens to send initial user info request
        try {
          //to aquire tokens silently we need to provide account.
          const token = await instance.acquireTokenSilent(silentTokenOptions);
          const user = await callApiWithToken(token.accessToken, msGraphMeEndpoint);
          console.log(`user`, user);
          dispatch(getUserStateWithAzure(user));
        } catch (error) {
          /* in case if silent token acquisition fails, fallback to an interactive method */
          instance.acquireTokenRedirect(loginScopes);
        }
      })();
    }
  }, [account, inProgress]);

  return (
    <>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={loginScopes} /*set of scopes to pre-consent to while sign in */
        errorComponent={ErrorLoginComponent}
      >
        {_.isEmpty(authError) ? (
          <Box height='60vh' display='flex' justifyContent='center' alignItems='center'>
            <CircularProgress color='primary' size={80} />
          </Box>
        ) : (
          <ErrorLoginComponent />
        )}
        {user?.id && <Redirect push to={`/workspace/${user.lastViewedWorkspace || ''}`} />}
      </MsalAuthenticationTemplate>
    </>
  );
}

export default AzureLoginPage;
