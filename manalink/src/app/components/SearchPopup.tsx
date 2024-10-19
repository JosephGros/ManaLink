import { useState } from "react";
import CustomLoader from "./CustomLoading";

interface User {
  _id: string;
  username: string;
  userCode: string;
  playgroups: string;
  xp: number;
  level: number;
  profilePicture: string;
  friends: string;
}

const SearchPopup = ({
  currentUserId,
  onSelectUser,
}: {
  currentUserId: string;
  onSelectUser: (user: any) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    let username = "";
    let userCode = "";

    if (searchInput.includes("#")) {
      [username, userCode] = searchInput.split("#");
    } else {
      username = searchInput;
    }

    try {
      const query = new URLSearchParams({
        ...(username && { username }),
        ...(userCode && { userCode }),
        currentUserId: currentUserId,
      }).toString();

      const response = await fetch(`/api/search-users?${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <input
        type="text"
        placeholder="Search for users..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <CustomLoader />}

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user._id}
              className="user-item"
              onClick={() => onSelectUser(user)}
            >
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                width={50}
                height={50}
              />
              <p>{user.username}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPopup;