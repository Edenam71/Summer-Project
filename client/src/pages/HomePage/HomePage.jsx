import styles from "./Home.module.css";
import { useEffect } from "react";
import HouseDetails from "../../components/HouseDetails";
import HouseForm from "../../components/HouseForm";
import { useHouseContext } from "../../hooks/useHouseContext";

const Home = () => {
  const { houses = [], dispatch } = useHouseContext();
  useEffect(() => {
    const fetchHouses = async () => {
      const response = await fetch("/api/House");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_HOUSES", payload: json });
      }
    };
    fetchHouses();
  }, [dispatch]);
  return (
    <div className="home">
      <div className="houses">
        {houses &&
          houses.map((house) => <HouseDetails house={house} key={house._id} />)}
      </div>
      <HouseForm />
    </div>
  );
};

export default Home;
