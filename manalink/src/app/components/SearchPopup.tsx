import { useState } from "react";
import CustomLoader from "./CustomLoading";
import Image from "next/image";
import searchIcon from "../../../public/assets/Icons/NavColor/search3.png";
import sendIcon from "../../../public/assets/Icons/NavColor/paper-plane2.png";

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
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-11/12 max-w-96 flex items-center justify-center mb-2">
          <input
            type="text"
            placeholder="Username#UserCode"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
          />
          <button
            onClick={handleSearch}
            className="bg-btn ml-2 p-2 rounded-md shadow-lg h-10 w-10"
          >
            <Image src={searchIcon} alt="Search" width={24} height={24} />
          </button>
        </div>
      </div>

      {loading && <CustomLoader />}

      <div className="max-h-64 w-80 overflow-auto shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)] rounded-md flex flex-col items-center p-2">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 bg-bg3 mx-2 rounded-lg my-1 shadow-md h-18 w-72"
            >
              <div className="flex flex-row justify-center justify-between items-center w-full">
                <div className="flex flex-row justify-center">
                  <div className="flex flex-col justify-center items-center col-span-2 w-18">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                      <Image
                        src={user.profilePicture}
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-32">
                    <p className="font-bold text-xl text-textcolor truncate">
                      <a
                        href={`/otherUserProfile/${user._id}?userId=${user._id}`}
                      >
                        {user.username}
                      </a>
                    </p>
                    <p className="text-xs text-start text-textcolor text-center mt-1">
                      lvl {user.level}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onSelectUser(user)}
                    className="bg-btn text-danger w-12 h-8 rounded-lg flex justify-center items-center"
                  >
                    <Image
                      src={sendIcon}
                      alt="Remove user"
                      width={25}
                      height={25}
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SearchPopup;