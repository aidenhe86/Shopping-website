import React from "react";

function NotFound() {
  setTimeout(function () {
    window.location.replace("/");
  }, 3000);

  return (
    <div className="Common">
      <h1>The page you're looking for doesn't exist.</h1>
      <div>Back to home in 3 seconds.</div>
    </div>
  );
}

export default NotFound;
