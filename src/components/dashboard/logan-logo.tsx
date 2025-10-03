import Image from 'next/image';

export function LoganLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logan_black.png"
      alt="Logan Logo"
      width={80}
      height={24}
      className={className}
      priority
    />
  );
}
