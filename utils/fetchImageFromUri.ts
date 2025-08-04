export const fetchImageFromUri = async (dataUri: string) => {
  try {
    const response = await fetch(dataUri);
    const data = response.json();
    return data;
  } catch (error) {
    console.error("Error fetching image data:", error);
    return null;
  }
};
