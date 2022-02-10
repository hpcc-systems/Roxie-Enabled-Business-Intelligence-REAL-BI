const { AZURE_TENANT_ID, AZURE_API_ID } = process.env;

module.exports = {
  // Required
  identityMetadata: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  // or 'https://login.microsoftonline.com/<your_tenant_guid>/v2.0/.well-known/openid-configuration'
  // or you can use the common endpoint
  // 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
  // Required if you are using common endpoint and setting `validateIssuer` to true.
  // For tenant-specific endpoint, this field is optional, we will use the issuer from the metadata by default.
  issuer: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0`,

  // Required
  clientID: AZURE_API_ID,

  // Required.
  // If you are using the common endpoint, you should either set `validateIssuer` to false, or provide a value for `issuer`.
  validateIssuer: true,

  // Required.
  // Set to false if you use `function(req, token, done)` as the verify callback.
  // Set to true if you use `function(req, token)` as the verify callback.
  passReqToCallback: false,

  // Optional, default value is clientID
  audience: AZURE_API_ID,

  // Optional. Default value is false.
  // Set to true if you accept access_token whose `aud` claim contains multiple values.
  allowMultiAudiencesInToken: true,

  // Optional. 'error', 'warn' or 'info'
  loggingLevel: 'info',
  scope: ['access_as_user'],
};
