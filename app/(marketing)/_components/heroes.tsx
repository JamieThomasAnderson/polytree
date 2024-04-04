import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[600px] h-[600px] sm:w-[350px] sm:h-[350px] md:h-[600px] md:w-[600px]">
          <Image
            src="/background.png"
            fill
            className="object-contain dark:hidden"
            alt="puzzel"
          />
        </div>
      </div>
    </div>
  );
};
