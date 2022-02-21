import React from "react";
import * as ReactDOM from "react-dom";

console.log(
  '👋 This message is being logged by "renderer.js", included via webpack'
);

document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Root = require("./root").default;
  ReactDOM.render(<Root />, document.getElementById("react-app"));
});
