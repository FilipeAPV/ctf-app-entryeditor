import MultiFieldsComponent from "../components/MultiFieldsComponent";
import { Flex, Grid, Paragraph, TextInput } from "@contentful/f36-components";
import { EditorAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { RichTextEditor } from "@contentful/field-editor-rich-text";

const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  const sdkField = useSDK<FieldAppSDK>();
  //console.log(sdkField);

  // Get all fields
  const fields = sdk.entry.fields;

  // Get field with more than 1 locale
  const fieldsWithLocales = Object.entries(fields).filter(
    ([key, value]) => value.locales && value.locales.length > 1
  );
  //console.log(fieldsWithLocales);

  return (
    <Flex
      style={{
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <Grid
        style={{ width: "80%" }}
        columns="1fr 1fr"
        rowGap="spacingM"
        columnGap="spacingM"
      >
        {fieldsWithLocales?.map(([key, value]) =>
          // Iterates over all locales per Entry
          value.locales?.map((locale) => (
            <div key={`${value.id}-${locale}`}>
              <p>{`${value.id} - ${locale}`}</p>
              {MultiFieldsComponent(sdk, sdkField, value, locale)}
            </div>
          ))
        )}
      </Grid>
    </Flex>
  );
};

export default Entry;
