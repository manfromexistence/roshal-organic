import Image from "next/image";

export function CompanyLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-8 bg-background">
        <Image
          src="/logo-light.svg"
          alt="Quadra EDMS Demo"
          width={32}
          height={32}
          priority
          className="absolute inset-0 h-full w-full dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          alt="Quadra EDMS Demo"
          width={32}
          height={32}
          priority
          className="absolute inset-0 hidden h-full w-full dark:block"
        />
      </div>
      <span className="text-lg font-semibold">Quadra EDMS Demo</span>
    </div>
  );
}
