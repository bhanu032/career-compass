/// <reference types="vite/client" />

// Re-export React's JSX namespace globally so `JSX.Element` works
// without importing React in every file (React 19 + react-jsx transform).
import React from "react";
declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
