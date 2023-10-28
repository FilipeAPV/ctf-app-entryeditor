import React from "react";
import { Paragraph } from "@contentful/f36-components";
import { FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { RichTextEditor } from "@contentful/field-editor-rich-text";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  console.log(sdk.field);
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return <RichTextEditor sdk={sdk} isInitiallyDisabled />;
  return <h1>Field</h1>;
};

export default Field;
