export function LoganLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g>
        <path
          d="M20,20 L40,20 L40,80 L20,80 L20,20 Z"
          className="fill-primary"
        />
        <circle cx="70" cy="50" r="20" className="fill-primary" />
        <path
          d="M60,50 A10,10 0 1,1 80,50 A10,10 0 1,1 60,50 Z"
          className="fill-background"
        />
      </g>
    </svg>
  );
}
