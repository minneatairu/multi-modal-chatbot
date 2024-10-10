import React from 'react';

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <h1>About Us Layout</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AboutLayout;
