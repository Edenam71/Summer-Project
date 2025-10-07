// MM/DD (always with leading zeros)
/*
import { useHouseContext } from "../hooks/useHouseContext";
import { useAuthContext } from "../hooks/useAuthContext";

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
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const res = await fetch(`/api/House/${house._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
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
*/
// client/src/components/HouseDetails.jsx
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";
import { useHouseContext } from "../hooks/useHouseContext";

const fmt = (d) => new Date(d).toLocaleDateString();

/** Decode a base64url JWT payload and return the user id (_id/sub) */
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // base64url -> base64 + padding
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = atob(padded);
    const obj = JSON.parse(json);
    return obj._id || obj.sub || null;
  } catch {
    return null;
  }
}

const HouseDetails = ({ house }) => {
  const { user } = useAuthContext();
  const { dispatch } = useHouseContext();

  // owner check: compare house.user_id with the id from the JWT
  const ownerId = user?.token ? getUserIdFromToken(user.token) : null;
  const isOwner = !!(ownerId && String(house.user_id) === String(ownerId));

  const handleDelete = async () => {
    if (!user) return;

    const res = await fetch(`/api/House/${house._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await res.json();

    if (res.ok) {
      // your reducer should remove it from state
      dispatch({ type: "DELETE_HOUSE", payload: json });
    } else {
      alert(json?.error || "Failed to delete");
    }
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
        <strong>Age:</strong> {house.age}
      </p>
      <p>
        <strong>Starting date:</strong> {fmt(house.starting_date)}
      </p>
      <p>
        <strong>Ending date:</strong> {fmt(house.ending_date)}
      </p>

      {/* images vs image (handle both just in case) */}
      {Array.isArray(house.images) ? (
        <p>
          <strong>Images:</strong> {house.images.join(", ")}
        </p>
      ) : (
        <p>
          <strong>Image:</strong> {house.image}
        </p>
      )}

      <p>
        {formatDistanceToNow(new Date(house.createdAt), { addSuffix: true })}
      </p>

      {/* show delete only for the owner */}
      {isOwner && (
        <span
          className="material-symbols-outlined"
          title="Delete"
          onClick={handleDelete}
          style={{ cursor: "pointer" }}
        >
          delete
        </span>
      )}
    </div>
  );
};

export default HouseDetails;
