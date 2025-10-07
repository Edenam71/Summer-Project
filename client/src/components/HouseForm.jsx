import { useState } from "react";
import { useHouseContext } from "../hooks/useHouseContext";
import { useAuthContext } from "../hooks/useAuthContext";

const GENDER_OPTIONS = ["female", "male", "non-binary", "any"];

const HouseForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useHouseContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState(18); // number, not ""
  const [gender, setGender] = useState("");
  const [starting_date, set_starting_date] = useState("");
  const [ending_date, set_ending_date] = useState("");
  const [imagesInput, setImagesInput] = useState(""); // FIX: define this
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must me logged in");
      return;
    }

    // Turn "url1, url2" into ["url1","url2"]
    const images = imagesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const house = {
      title,
      description,
      age,
      gender,
      starting_date,
      ending_date,
      images,
    }; // FIX: send array called "images"

    try {
      const response = await fetch("/api/House", {
        method: "POST",
        body: JSON.stringify(house),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }, // FIX: correct header
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || "Failed to create house");
        setEmptyFields(json.emptyFields);
        return;
      }

      // success: reset
      setTitle("");
      setDescription("");
      setAge(18);
      setGender("");
      setImagesInput("");
      set_starting_date("");
      set_ending_date("");
      setError(null);
      setEmptyFields([]);
      console.log("new house added", json);
      dispatch({ type: "CREATE_HOUSE", payload: json });
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  return (
    <form className="create" noValidate onSubmit={handleSubmit}>
      <h3>Add a new house</h3>

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={emptyFields.includes("title") ? "error" : ""}
        required
      />

      <label>Description:</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={emptyFields.includes("description") ? "error" : ""}
        required
      />

      <label>Gender:</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className={emptyFields.includes("gender") ? "error" : ""}
        required
      >
        <option value="" disabled>
          Select…
        </option>
        {GENDER_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <label>Required Age:</label>
      <input
        type="number"
        min={18}
        value={age}
        onChange={(e) => setAge(e.target.valueAsNumber)}
        className={emptyFields.includes("age") ? "error" : ""}
        required
      />

      <label>Starting date of contract:</label>
      <input
        type="date"
        value={starting_date}
        onChange={(e) => set_starting_date(e.target.value)}
        className={emptyFields.includes("starting_date") ? "error" : ""}
        required
      />

      <label>Ending date of contract:</label>
      <input
        type="date"
        value={ending_date}
        onChange={(e) => set_ending_date(e.target.value)}
        className={emptyFields.includes("ending_date") ? "error" : ""}
        required
      />

      <label>Image URLs (comma-separated):</label>
      <input
        type="text"
        placeholder="https://… , https://…"
        value={imagesInput}
        onChange={(e) => setImagesInput(e.target.value)}
        className={emptyFields.includes("images") ? "error" : ""}

        // set required only if your schema requires at least one image:
        // required
      />

      <button type="submit">Upload new house</button>
      {error && <div className="error">{String(error)}</div>}
    </form>
  );
};

export default HouseForm;

/*
import { useState } from "react";
const GENDER_OPTIONS = ["female", "male", "non-binary", "any"];

const HouseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const house = { title, description, age, gender, image };
    const response = await fetch("/api/House", {
      method: "POST",
      body: JSON.stringify(house),
      headers: {
        "Content type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setTitle("");
      setDescription("");
      setAge("");
      setGender("");
      setImage("");
      setError(null);
      console.log("new house added");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new house</h3>
      <label>Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      <label>Gender:</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      >
        <option value="" disabled>
          Select…
        </option>
        {GENDER_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <label>Required Age:</label>
      <input
        type="number"
        min={18}
        value={age}
        onChange={(e) => setAge(e.target.valueAsNumber)}
      />

      <label>Image URLs (comma-separated):</label>
      <input
        type="text"
        placeholder="https://… , https://…"
        value={imagesInput}
        onChange={(e) => setImagesInput(e.target.value)}
        required
      />
      <button>Upload new house</button>
      {error && <div className="error"> error</div>}
    </form>
  );
};

export default HouseForm;
*/
