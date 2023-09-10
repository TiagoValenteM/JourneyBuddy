import * as ImageManipulator from "expo-image-manipulator";

const resizeImage = async (uri: string, width: number, height: number) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: width, height: height } }],
      { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
    );

    return resizedImage.uri;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};

export default resizeImage;
