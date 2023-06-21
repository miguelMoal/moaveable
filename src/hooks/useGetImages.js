import { useEffect, useState } from "react";

//Connections
import { getImages } from "../connections";

const useGetImages = () => {
  const [images, setImages] = useState([]);

  const _getImages = async () => {
    const data = await getImages();
    setImages(data);
  };

  useEffect(() => {
    _getImages();
  }, []);

  return { images };
};
export default useGetImages;
