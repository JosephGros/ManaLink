import Image from "next/image";

export default function Home() {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <button className="bg-btn">
        <a href="/home">HOME</a>
      </button>
    </div>
  );
}