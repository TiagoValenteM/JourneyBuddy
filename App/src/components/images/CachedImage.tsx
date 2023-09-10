import React, { useState, useEffect } from "react";
import { ImageStyle, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import md5 from "md5";

interface CachedImageProps {
  source: { uri: string };
  style: ImageStyle;
}

// Checks if given directory exists. If not, creates it
async function ensureDirExists(dir: string) {
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    console.log("Directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

// Deletes whole directory with all its content
export async function deleteAllGifs(dir: string) {
  console.log("Deleting all files...");
  await FileSystem.deleteAsync(dir);
}

const createSafeFilePath = (filename: string): string => {
  const imageUriHash = md5(filename);
  return `image-${imageUriHash}.png`;
};

// Returns URI to our local cached file
// If our file doesn't exist locally, it downloads it
async function getCachedLocalFile(directory: string, remoteUri: string) {
  const cacheDirectoryPath = FileSystem.cacheDirectory + directory;
  await ensureDirExists(cacheDirectoryPath);

  const fileUri = cacheDirectoryPath + createSafeFilePath(remoteUri);
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    // console.log(`File isn't cached locally. Downloading from: ${remoteUri}`);
    await FileSystem.downloadAsync(remoteUri, fileUri);
  }

  return fileUri;
}

const CachedImage: React.FC<CachedImageProps> = ({ source, style }) => {
  const [localSource, setLocalSource] = useState<ImageSourcePropType>();
  const blurhash = "ChG0FWNGogkD%%s:t8og";

  useEffect(() => {
    if (source?.uri?.length > 0) {
      if (source.uri.includes("file://")) {
        setLocalSource({ uri: source.uri });
      } else {
        getCachedLocalFile("images/", source.uri)
          .then((fileUri) => {
            // console.log(`Loading cached Image: ${fileUri}`);
            setLocalSource({ uri: fileUri });
          })
          .catch((err) => {
            // console.log("Error caching image, using remote...");
            console.log(err);
            setLocalSource({ uri: source.uri }); // Defaults to remote uri
          });
      }
    } else {
      setLocalSource({});
    }
  }, [source?.uri]);

  if (localSource) {
    return (
      <Image
        source={localSource}
        style={style}
        contentFit="cover"
        transition={300}
        placeholder={blurhash}
        cachePolicy={"memory-disk"}
      />
    );
  }

  return null;
};

export default CachedImage;
