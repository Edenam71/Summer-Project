// client/src/pages/HomePage/HomePage.jsx
import styles from "./Home.module.css";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HouseDetails from "../../components/HouseDetails";
import HouseForm from "../../components/HouseForm";
import { useHouseContext } from "../../hooks/useHouseContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const Home = () => {
  const { houses = [], dispatch } = useHouseContext();
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();

  // /?mine=1 => show only my houses
  const onlyMine = useMemo(
    () => searchParams.get("mine") === "1",
    [searchParams]
  );

  useEffect(() => {
    const fetchHouses = async () => {
      const url = onlyMine ? "/api/House/mine" : "/api/House";

      const options =
        onlyMine && user
          ? { headers: { Authorization: `Bearer ${user.token}` } }
          : {};

      const res = await fetch(url, options);
      const json = await res.json();
      if (res.ok) {
        dispatch({ type: "SET_HOUSES", payload: json });
      }
    };

    fetchHouses();
  }, [dispatch, onlyMine, user]);

  return (
    <div className="home">
      <div className="houses">
        {houses.map((house) => (
          <HouseDetails key={house._id} house={house} />
        ))}
      </div>
      <HouseForm />
    </div>
  );
};

export default Home;
