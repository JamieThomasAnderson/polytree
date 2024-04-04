import Image from "next/image";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import Head from "next/head";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-white to-stone-300">
      <div className="flex flex-row items-center justify-center text-center space-x-12 gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Heroes />
      </div>
    </div>
  );
};

export default MarketingPage;
