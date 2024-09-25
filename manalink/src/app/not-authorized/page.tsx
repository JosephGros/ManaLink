function NotAuthorizedPage() {
    return (
      <div>
        <h1 className="text-textcolor">Not Authorized</h1>
        <p className="text-textcolor">You do not have access to view this page.</p>

        <button className="bg-btn text-textcolor p-2 rounded-md mt-4">
            <a href="/">Home</a>
        </button>
      </div>
    );
  };  

export default NotAuthorizedPage;