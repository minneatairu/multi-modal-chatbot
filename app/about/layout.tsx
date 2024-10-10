// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'My App',
  description: 'An example app',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Global Header</h1>
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

