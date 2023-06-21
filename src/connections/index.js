import axios from "axios";

export const getImages = async () => {
  try {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/photos"
    );
    return result.data;
  } catch (error) {
    console.log(`error al extraer imagenes ${error}`);
  }
};
