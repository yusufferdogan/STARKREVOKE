import React from 'react';
import 'tailwindcss/tailwind.css';
import MyFooter from '../Footer';
function Home() {
  return (
    <div>
      <div className="h-screen justify-center flex">
        Made by
        <span>
          <a
            href="https://github.com/yusufferdogan"
            className="text-sky-400 font-extrabold"
          >
            &nbsp;@yusufferdogan
          </a>
        </span>
      </div>
      <MyFooter></MyFooter>
    </div>
  );
}

export default Home;
