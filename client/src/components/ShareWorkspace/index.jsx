import React from 'react';

// React Components
import { Dashboards, ShareRecipients } from './Tabs';

const ShareWorkspace = props => {
  return (
    <>
      <ShareRecipients {...props} />
      <Dashboards {...props} />
    </>
  );
};

export default ShareWorkspace;
