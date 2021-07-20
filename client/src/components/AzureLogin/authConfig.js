// eslint-disable-next-line no-unused-vars
import { LogLevel } from '@azure/msal-browser';
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */

const { REACT_APP_AZURE_REDIRECT_URI, REACT_APP_AZURE_CLIENT_ID, REACT_APP_AZURE_TENANT_ID } = process.env;

export const msalConfig = {
  auth: {
    clientId: REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${REACT_APP_AZURE_TENANT_ID}`,
    redirectUri: REACT_APP_AZURE_REDIRECT_URI,
    postLogoutRedirectUri: REACT_APP_AZURE_REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  // Uncomment for logs in console
  // system: {
  //   loggerOptions: {
  //     loggerCallback: (level, message, containsPii) => {
  //       if (containsPii) {
  //         return;
  //       }
  //       switch (level) {
  //         case LogLevel.Error:
  //           console.error(message);
  //           return;
  //         case LogLevel.Info:
  //           console.info(message);
  //           return;
  //         case LogLevel.Verbose:
  //           console.debug(message);
  //           return;
  //         case LogLevel.Warning:
  //           console.warn(message);
  //           return;
  //       }
  //     },
  //   },
  // },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginScopes = {
  scopes: ['User.read', 'email'],
};
// export const apiScopes = {
//   scopes: ['api://cc565084-7256-48d5-88f1-b00f25766f9b/access_as_user'],
// };
