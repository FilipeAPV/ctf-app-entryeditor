import { FormControl, TextInput } from "@contentful/f36-components";
import RichText from "./RichText";
import * as Contentful from "@contentful/rich-text-types";
import { RichTextEditor } from "@contentful/field-editor-rich-text";
import "/node_modules/flag-icons/css/flag-icons.min.css";

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

const MultiFieldsComponent = (sdk, sdkField, value, locale) => {
  const fieldDetail = sdk.entry.fields[value.id].getForLocale(locale);
  const fieldValue = fieldDetail.getValue();
  const countryCode = getCountryCode(locale);
  if (value.type === "Symbol") {
    return (
      <FormControl>
        <FormControl.Label
          //isRequired
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>{fieldDetail.name}</p>
          <p>
            {(locale as String).toLocaleUpperCase()}
            <span
              className={`fi fi-${countryCode}`}
              style={{ marginLeft: "5px" }}
            />
          </p>
        </FormControl.Label>
        <TextInput
          name={fieldDetail.id}
          value={fieldValue}
          title={fieldDetail.name}
        />
      </FormControl>
    );
  }
  if (value.type === "RichText") {
    const modifiedSdk = {
      ...sdkField,
      field: {
        ...sdk.entry.fields[value.id],
        getValue: () =>
          sdk.entry.fields[value.id].getForLocale(locale).getValue(),
        onSchemaErrorsChanged: () => {},
        onIsDisabledChanged: () => {},
        onValueChanged: () => () => {},
        removeValue: () => Promise.resolve(),
        setValue: () => Promise.resolve(undefined),
      },
    };
    return (
      <FormControl>
        <FormControl.Label isRequired>{fieldDetail.name}</FormControl.Label>
        <RichTextEditor sdk={modifiedSdk} isInitiallyDisabled={false} />
      </FormControl>
    );
  }

  return <h1>a</h1>;
};

export default MultiFieldsComponent;
