import Image from 'next/image';

export function LoganLogo({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'relative', width: 'auto' }}>
      <Image 
        src="/Logan_black.png" 
        alt="Logan Logo"
        width={80}
        height={24}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}
