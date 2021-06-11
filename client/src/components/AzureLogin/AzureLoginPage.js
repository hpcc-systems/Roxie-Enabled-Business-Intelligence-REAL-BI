/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
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

  const dispatch = useDispatch();

  const history = useHistory();

  const silentTokenOptions = {
    scopes: [loginScopes.scopes[0]],
    account: account,
  };

  const getUserInfo = async () => {
    try {
      const lastViewedWorkspace = await dispatch(getUserStateWithAzure());
      if (lastViewedWorkspace) {
        history.push(`/workspace/${lastViewedWorkspace}`);
      } else {
        history.push(`/workspace/`);
      }
    } catch (error) {
      console.log('error happened it is in redux store', error);
    }
  };

  useEffect(() => {
    if (account && inProgress === 'none') {
      /* set account to Active for Axios interceptor to send HTTPS with fresh tokens */
      instance.setActiveAccount(account);
      (async () => {
        try {
          /* access token to hit our api aquired silently */
          await instance.acquireTokenSilent(silentTokenOptions);
          await getUserInfo();
        } catch (error) {
          /* in case if silent token acquisition fails, fallback to an interactive method */
          if (error instanceof InteractionRequiredAuthError) {
            if (account && inProgress === 'none') {
              try {
                await instance.acquireTokenPopup(loginScopes);
                await getUserInfo();
              } catch (error) {
                /*Something went Wrong with PopUp signin we need fallback screen and button to try again*/
                console.log('Something went Wrong with PopUp signin', error);
                // history.replace('/');
              }
            }
          } else {
            /*Error is not caused by SSO we need to show fallback screen*/
            console.log('Error is not caused by SSO we need to show fallback screen', error);
            // history.replace('/');
          }
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
        // loadingComponent={loadingComponent}
      />
    </>
  );
}

export default AzureLoginPage;
