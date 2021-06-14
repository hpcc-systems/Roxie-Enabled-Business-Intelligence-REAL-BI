/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { InteractionRequiredAuthError, InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { useHistory } from 'react-router';
import { apiScopes, loginScopes } from './authConfig';
import { useDispatch } from 'react-redux';
import { getUserStateWithAzure } from '../../features/auth/actions';
import ErrorLoginComponent from './ErrorLoginComponent';

function AzureLoginPage() {
  /* useMsal is hook that returns the PublicClientApplication instance */
  const { instance, accounts, inProgress } = useMsal();
  const account = accounts[0] || null;

  const [initUserError, setInitUserError] = useState(null);

  const dispatch = useDispatch();

  const history = useHistory();

  const getUserInfo = async () => {
    try {
      const lastViewedWorkspace = await dispatch(getUserStateWithAzure());
      history.push(`/workspace/${lastViewedWorkspace || ''}`);
    } catch (error) {
      setInitUserError(error);
    }
  };

  const aquireTokens = async () => {
    //to aquire tokens silently we need to provide account.
    const silentTokenOptions = {
      ...loginScopes,
      account: account,
    };
    try {
      /* access token to hit our api aquired silently */
      await instance.acquireTokenSilent(silentTokenOptions);
    } catch (error) {
      /* in case if silent token acquisition fails, fallback to an interactive method */
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(loginScopes);
      }
    }
  };

  useEffect(() => {
    if (account && inProgress === 'none') {
      /* set account to Active for Axios interceptor to send HTTPS with fresh tokens */
      instance.setActiveAccount(account);
      (async () => {
        //1. Aquire fresh tokens to send initial user info request
        await aquireTokens();
        //2. Send a request to get user info
        await getUserInfo();
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
        {initUserError && <ErrorLoginComponent error={initUserError} />}
      </MsalAuthenticationTemplate>
    </>
  );
}

export default AzureLoginPage;
