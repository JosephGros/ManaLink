interface DeleteDeckPopupProps {
    deckName: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  const DeleteDeckPopup: React.FC<DeleteDeckPopupProps> = ({
    deckName,
    onConfirm,
    onCancel,
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-bg2 p-6 rounded shadow-md w-80 text-center">
          <h2 className="text-xl font-bold mb-4">Delete Deck</h2>
          <p className="mb-4">
            Are you sure you want to delete the deck "{deckName}"? This action
            cannot be undone.
          </p>
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
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteDeckPopup;  