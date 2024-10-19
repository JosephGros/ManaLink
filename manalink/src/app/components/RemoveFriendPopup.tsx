interface RemoveFriendPopupProps {
  friendName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RemoveFriendPopup: React.FC<RemoveFriendPopupProps> = ({ friendName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Remove Friend</h2>
        <p className="mb-4">Are you sure you want to remove {friendName} from your friends?</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFriendPopup;