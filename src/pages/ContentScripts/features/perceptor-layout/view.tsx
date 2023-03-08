import React from 'react';

const View = (): JSX.Element => {
  return (
    <div
      data-view-component="true"
      className="Layout Layout--flowRow-until-md Layout--sidebarPosition-start Layout--sidebarPosition-flowRow-start Layout--sidebar-narrow"
    >
      <div data-view-component="true" className="Layout-sidebar"></div>
      <div data-view-component="true" className="Layout-main"></div>
    </div>
  );
};

export default View;
