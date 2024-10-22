interface RemoveFriendPopupProps {
  friendName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RemoveFriendPopup: React.FC<RemoveFriendPopupProps> = ({ friendName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-bg2 p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Remove Friend</h2>
        <p className="mb-4">Are you sure you want to remove {friendName} from your friends?</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="w-24 h-9 bg-btn rounded-md text-nav font-bold shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-24 h-9 bg-btn rounded-md text-danger2 font-bold shadow-lg"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFriendPopup;