import { useContext } from "react";
import { LoadingContext } from "../context/loadingHandlerContext";

export const useLoading = () => {
  const { loadingVisible, setLoadingVisible } = useContext(LoadingContext);

  const startLoading = (message?: string) => {
    setLoadingVisible(true);
  };

  const stopLoading = () => {
    setLoadingVisible(false);
  };

  return {
    loadingVisible,
    startLoading,
    stopLoading,
  };
};
