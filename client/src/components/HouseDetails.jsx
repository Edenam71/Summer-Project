// MM/DD (always with leading zeros)
import { useHouseContext } from "../hooks/useHouseContext";

//date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const fmt = (d) =>
  d
    ? new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC", // keeps YYYY-MM-DD stable across timezones
      }).format(new Date(d))
    : "";

const HouseDetails = ({ house }) => {
  const { dispatch } = useHouseContext();
  const handleClick = async () => {
    const res = await fetch(`/api/House/${house._id}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(json);
      alert(json.error || "Failed to delete");
      return;
    }
    dispatch({ type: "DELETE_HOUSE", payload: json });
  };

  return (
    <div className="house-details">
      <h4>{house.title}</h4>
      <p>
        <strong>Description: </strong>
        {house.description}
      </p>
      <p>
        <strong>Gender: </strong>
        {house.gender}
      </p>
      <p>
        <strong>Age:</strong>
        {house.age}
      </p>
      <p>
        <strong>Starting date:</strong>
        {fmt(house.starting_date)}
      </p>
      <p>
        <strong>Ending date:</strong>
        {fmt(house.ending_date)}
      </p>
      <p>
        <strong>Image:</strong>
        {house.image}
      </p>
      <p>{house.createdAt}</p>
      <p>
        {formatDistanceToNow(new Date(house.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default HouseDetails;
