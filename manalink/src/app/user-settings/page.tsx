import ProfileSettings from "../components/ProfilePicture";
import UpdateUserForm from "../components/UpdateUserForm";

const UserSettingsPage = () => {
    return (
        <div>
            <div>
                <ProfileSettings />
            </div>
            <div>
                <UpdateUserForm />
            </div>
        </div>
    );
};

export default UserSettingsPage;