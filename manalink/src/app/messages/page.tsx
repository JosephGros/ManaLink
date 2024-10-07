import ChatList from "../components/ChatList";
import ChatNav from "../components/MessagesNav";

const ChatPage = () => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-14 w-full bg-background flex justify-center items-center z-10">
                <h1 className="text-3xl font-bold text-center text-textcolor">Messages</h1>
            </div>
            <div className="fixed top-14 left-0 right-0 bottom-[120px]">
                <div className="w-full h-full flex flex-col overflow-auto">
                    <ChatList />
                </div>
            </div>
            <div className="fixed bottom-16 left-0 right-0 h-14 bg-background z-10">
                <ChatNav />
            </div>
        </>
    );
};

export default ChatPage;