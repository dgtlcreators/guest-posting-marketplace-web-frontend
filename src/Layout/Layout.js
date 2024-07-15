import React from 'react';

const Layout = ({ children, isRegisterPage }) => {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8">
        <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 flex flex-col items-center justify-center">
            <div>
              <a
                className="text-white text-4xl font-bold mb-4"
                href="/"
              >
                Guest-Posting
              </a>
              <p className="opacity-75 mb-4">
                Never Pay Until You’re 100% Satisfied - Increasing traffic, leads and sales.
              </p>
              <div className="mt-3 mb-4">
                <p className="pt-3">
                  <span className='p-2'>{isRegisterPage ? 'Have an account?' : "Don't have an account?"}</span>
                  <br />
                  <a className="p-2 m-3 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition duration-200" href={isRegisterPage ? '/login' : '/signup'} role="button">
                    {isRegisterPage ? 'Log In' : 'Sign Up'}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
