import Image from "next/image";
import logo from "../../../public/assets/ManaLinkLogo.png";

const ForumPage = async () => {
  return (
    <div className="flex flex-col justify-center items center">
      <div>
        <Image
          src={logo}
          alt="ManaLink Logo"
          width={380}
          height={200}
          className="mx-auto mb-16"
        />
      </div>
      <h1 className="font-bold text-4xl text-textcolor w-full text-center">Stay tuned!</h1>
    </div>
  );
};

export default ForumPage;
