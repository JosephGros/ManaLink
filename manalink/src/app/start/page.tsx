import Image from "next/image";
import logo from "../../../public/assets/ManaLinkLogo.png";
import Carousel from "../components/Carousel";

export default function Home() {

  const presetImages = [ 
    "/assets/AppImages/screen1.png", 
    "/assets/AppImages/screen2.png", 
    "/assets/AppImages/screen3.png", 
    "/assets/AppImages/screen4.png", 
    "/assets/AppImages/screen5.png",
    "/assets/AppImages/screen6.png",
    "/assets/AppImages/screen7.png",
    "/assets/AppImages/screen8.png"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="mb-6">
        <Image
          src={logo}
          alt="ManaLink Logo"
          width={300}
          height={200}
          className="mx-auto"
        />
      </div>

      <div className="text-center mb-8">
        <p className="mt-4 text-lg font-bold text-textcolor">
        Plan, Play, and Connect: Your Ultimate Magic: The Gathering Game Session Scheduler
        </p>
        <p className="mt-4 text-textcolor">
          Easily organize and book game sessions with your playgroup. ManaLink makes it effortless to find the perfect time for your next epic Magic: The Gathering battle!
        </p>
      </div>
      <div className="flex space-x-4 mb-10">
        <button className="w-32 h-10 bg-btn rounded-md text-nav font-bold shadow-lg hover:bg-light-btn-hover">
          <a href="/register">Register</a>
        </button>
        <button className="w-32 h-10 bg-btn rounded-md text-nav font-bold shadow-lg hover:bg-light-btn-hover">
          <a href="/login">Login</a>
        </button>
      </div>
      <Carousel />
      <footer className="w-full text-center py-4 border-t mt-8 text-gray-500">
        <p>Contact us at: info@manalink.com | Follow us on social media</p>
        <p>&copy; 2024 ManaLink. All rights reserved.</p>
      </footer>
    </div>
  );
}