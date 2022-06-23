import React, { ReactNode, useContext, useState } from "react";
import loadingIcon from "@/assets/icon/loading.svg";

const LoadingContext = React.createContext<
  { loading: boolean; setLoading: (isLoading: boolean) => void } | undefined
>(undefined);

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const updateLoading = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading: updateLoading }}>
      <div className="min-h-screen bg-blue-primary bg-opacity-95">
        {children}
        {loading && (
          <div className="w-full h-screen fixed top-0 bg-black/50 bg-fixed flex items-center justify-center z-50">
            <img src={loadingIcon} alt="" className="w-12 h-12 animate-spin" />
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const { loading, setLoading } = useContext(LoadingContext)!;
  return [loading, setLoading] as const;
};

export default LoadingProvider;
