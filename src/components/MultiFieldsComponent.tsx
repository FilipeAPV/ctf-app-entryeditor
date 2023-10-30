import { useState, useEffect, ChangeEvent, useMemo } from "react";
import { FormControl, TextInput } from "@contentful/f36-components";
import RichText from "./RichText";
import * as Contentful from "@contentful/rich-text-types";
import { RichTextEditor } from "@contentful/field-editor-rich-text";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { stat } from "fs";
import { EditorAppSDK, EntryFieldAPI, FieldAppSDK } from "@contentful/app-sdk";

type MultiFieldsComponentProps = {
  sdk: EditorAppSDK;
  sdkField: FieldAppSDK;
  value: EntryFieldAPI;
  locale: string;
};

const getCountryCode = (locale: string) => {
  switch (locale) {
    case "en-US":
      return "us";
    case "fr-FR":
      return "fr";
    default:
      return "xx";
  }
};

const MultiFieldsComponent = ({
  sdk,
  sdkField,
  value,
  locale,
}: MultiFieldsComponentProps) => {
  const [state, setState] = useState({});

  useEffect(() => {
    const fieldDetail = sdk.entry.fields[value.id].getForLocale(locale);
    const fieldState = {
      field: sdk.entry.fields[value.id],
      fieldName: fieldDetail.name,
      fieldId: fieldDetail.id,
      fieldDetail,
      fieldValue: fieldDetail.getValue(),
    };
    setState(fieldState);
  }, [locale, sdk, value.id]);

  const handleOnChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const elementValue = e.target.value;
    state.fieldDetail.setValue(elementValue);
    setState((prevValue) => ({ ...prevValue, fieldValue: elementValue }));
  };

  const countryCode = getCountryCode(locale);
  if (value.type === "Symbol") {
    return (
      <FormControl>
        <FormControl.Label
          //isRequired
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>{state.fieldName}</p>
          <p>
            {(locale as String).toLocaleUpperCase()}
            <span
              className={`fi fi-${countryCode}`}
              style={{ marginLeft: "5px" }}
            />
          </p>
        </FormControl.Label>
        <TextInput
          name={state.fieldId}
          value={state.fieldValue}
          title={state.fieldName}
          onChange={handleOnChange}
        />
      </FormControl>
    );
  }

  if (value.type === "RichText") {
    console.count("RichText Rendering");
    const modifiedSdk = {
      ...sdkField,
      field: {
        ...state.field,
        getValue: () => state.fieldDetail?.getValue(),
        onSchemaErrorsChanged: () => {},
        onIsDisabledChanged: () => {},
        onValueChanged: () => {},
        removeValue: () => state.fieldDetail?.removeValue(),
        setValue: (newValue) => state.fieldDetail?.setValue(newValue),
      },
    };

    if (!state.fieldDetail) return <h1>Loading...</h1>;
    return (
      <FormControl>
        <FormControl.Label isRequired>{state.fieldName}</FormControl.Label>
        <RichTextEditor sdk={modifiedSdk} isInitiallyDisabled={false} />
      </FormControl>
    );
  }

  return <h1>a</h1>;
};

export default MultiFieldsComponent;
