import { HouseContext } from "../context/HouseContext";
import { useContext } from "react";
export const useHouseContext = () => {
  const context = useContext(HouseContext);

  if (!context) {
    throw Error("useHouseContext must be used inside an HouseContextProvider");
  }
  return context;
};
