/*
import { createContext, useReducer } from "react";

export const HouseContext = createContext();

export const houseReducer = (state, action) => {
  switch (action.type) {
    case "SET_HOUSES":
      return {
        house: action.payload,
      };
    case "CREATE_HOUSE":
      return {
        house: [action.payload, ...state.house],
      };
    default:
      return state;
  }
};

//children represents app we wrapped in houseContext
export const HouseContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(houseReducer, { house: null });

  return (
    <HouseContext.Provider value={{ ...state, dispatch }}>
      {children}
    </HouseContext.Provider>
  );
};
*/
import { createContext, useReducer } from "react";

export const HouseContext = createContext();

const initialState = { houses: [] };

export const houseReducer = (state, action) => {
  switch (action.type) {
    case "SET_HOUSES":
      // payload: House[]
      return { houses: action.payload };

    case "CREATE_HOUSE":
      // payload: House
      return { houses: [action.payload, ...state.houses] };

    // (optional) useful later
    case "DELETE_HOUSE":
      // payload: id or house
      return {
        houses: state.houses.filter((h) => h._id !== action.payload._id),
      };

    default:
      return state;
  }
};

// Provider
export const HouseContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(houseReducer, initialState);

  return (
    <HouseContext.Provider value={{ ...state, dispatch }}>
      {children}
    </HouseContext.Provider>
  );
};
