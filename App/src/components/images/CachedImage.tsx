import React, { useState, useEffect } from "react";
import {
  Image,
  ImageStyle,
  ImageResizeMode,
  ImageSourcePropType,
} from "react-native";

interface CachedImageProps {
  source: { uri: string };
  style: ImageStyle;
  resizeMode?: ImageResizeMode;
}

const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  resizeMode = "cover",
}) => {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const loadCachedImage = async () => {
      setUri(source.uri);
    };

    loadCachedImage();
  }, [source.uri]);

  if (uri) {
    const imageSource: ImageSourcePropType = { uri };
    return <Image source={imageSource} style={style} resizeMode={resizeMode} />;
  }

  return null;
};

export default CachedImage;
