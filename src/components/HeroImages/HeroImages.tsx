import { FC, useEffect, useState } from "react";
import {
  EditorAppSDK,
  FieldAppSDK,
  Asset,
  FieldAPI,
} from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { AssetCard, Button, MenuItem } from "@contentful/f36-components";
import { FormControl, TextInput } from "@contentful/f36-components";
import { ContentTypeFieldValidation } from "contentful-management";

interface HeroImagesProps {}

const HeroImages = ({}) => {
  const [assetList, setAssetList] = useState<(Asset | null)[]>([]);

  const sdk = useSDK<EditorAppSDK>();
  const defaultLocale = sdk.locales.default;

  /* Validation, how to proceed
  const currentField = sdk.entry.fields.bigPictures;
  currentField
    .getForLocale(defaultLocale)
    .onSchemaErrorsChanged((error) => console.log(error));
  */

  /* 
  This effect runs after the component's initial render and whenever there's a change in the 'bigPictures' field from Contentful or in the assets API call.
  First, it retrieves the current list of images from the 'bigPictures' field.
  For each of these images, it fetches its asset details using the Contentful Management API.
  Once all assets are fetched, it updates the local assetList state with the retrieved assets.
  */
  useEffect(() => {
    const currentImages = sdk.entry.fields.bigPictures.getValue() || [];
    const ids = currentImages.map((image) => image.sys.id);
    Promise.all(ids.map((id) => sdk.cma.asset.get({ assetId: id })))
      .then((assets) => setAssetList(assets))
      .catch((error) => console.error("Error fetching assets:", error));
    //console.log(currentImages);
  }, [sdk.cma.asset, sdk.entry.fields.bigPictures]);

  /* 
  This effect synchronizes our local assetList state with the Contentful 'bigPictures' field. 
  Whenever there's a change in the assetList, it maps over each asset to create a reference 
  in the format that Contentful expects (type: "Link") and then sets that updated list 
  as the new value for the 'bigPictures' field in Contentful.
  */
  useEffect(() => {
    const updatedAssets = assetList.map((asset) => {
      return {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: asset?.sys.id,
        },
      };
    });
    if (updatedAssets.length > 1) {
      sdk.entry.fields.bigPictures.setValue(updatedAssets);
    }
  }, [assetList, sdk.entry.fields.bigPictures]);

  const openAssetPicker = () => {
    sdk.dialogs
      .selectSingleAsset()
      .then((asset) => {
        //console.log(asset);
        //console.log(asset?.fields.file[defaultLocale].url);
        asset && setAssetList((list) => [...list, asset as Asset]);
      })
      .catch((err) => {
        console.error("Error in the function const openAssetPicker = () => {");
        console.error(err);
      });
  };

  const removeAssetFromList = (assetId: string) => {
    setAssetList((prevList) =>
      prevList.filter((asset) => asset?.sys.id !== assetId)
    );
  };

  function openAsset(id: string) {
    sdk.navigator.openAsset(id, { slideIn: true });
  }

  // Handle drag start event
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e, index) => {
    e.preventDefault();

    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    const newAssetList = [...assetList];

    // Swap the elements
    [newAssetList[draggedIndex], newAssetList[index]] = [
      newAssetList[index],
      newAssetList[draggedIndex],
    ];

    setAssetList(newAssetList);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Button
        onClick={() => openAssetPicker()}
        style={{ marginBottom: "10px" }}
      >
        Pick existent asset
      </Button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {assetList?.map((asset, index) => (
          <div
            key={asset?.sys.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <AssetCard
              withDragHandle
              key={asset?.sys.id}
              status={asset?.sys.publishedVersion ? "published" : "draft"}
              type="image"
              title={asset?.fields.title[defaultLocale]}
              src={asset?.fields.file[defaultLocale].url}
              size="small"
              style={{ width: "185px", height: "187px" }}
              actions={[
                <MenuItem
                  key="edit"
                  onClick={() => asset?.sys.id && openAsset(asset.sys.id)}
                >
                  Edit
                </MenuItem>,
                <MenuItem
                  key="remove"
                  onClick={() =>
                    asset?.sys.id && removeAssetFromList(asset.sys.id)
                  }
                >
                  Remove
                </MenuItem>,
              ]}
            />
          </div>
        ))}
      </div>
      {<FormControl.HelpText>Manual Validation Needed</FormControl.HelpText>}
    </div>
  );
};

export default HeroImages;
