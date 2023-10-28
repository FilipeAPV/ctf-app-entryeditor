import { TextInput } from "@contentful/f36-components";
import RichText from "./RichText";
import * as Contentful from "@contentful/rich-text-types";
import { RichTextEditor } from "@contentful/field-editor-rich-text";

const MultiFieldsComponent = (sdk, sdkField, value, locale) => {
  const fieldDetail = sdk.entry.fields[value.id].getForLocale(locale);
  const fieldValue = fieldDetail.getValue();

  if (value.type === "Symbol") {
    return (
      <TextInput
        name={fieldDetail.id}
        value={fieldValue}
        title={fieldDetail.name}
      />
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
    return <RichTextEditor sdk={modifiedSdk} isInitiallyDisabled={false} />;
  }

  return <h1>a</h1>;
};

export default MultiFieldsComponent;
