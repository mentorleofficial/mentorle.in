// Pixel-style line icons matching the design's opportunity meta row (people, location pin, wallet).
const pixel = { viewBox: "0 0 16 16", "aria-hidden": true, className: "size-[1.375rem] shrink-0 fill-current" } as const;

export function PeopleIcon() {
  return (
    <svg {...pixel}>
      <path d="M4 2h3v1H4zM3 3h1v3H3zM7 3h1v3H7zM4 6h3v1H4zM10 2h2v1h-2zM12 3h1v3h-1zM10 6h2v1h-2zM2 9h7v1H2zM1 10h1v4H1zM9 10h1v4H9zM11 9h3v1h-3zM14 10h1v4h-1z" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...pixel}>
      <path d="M5 1h6v1H5zM3 2h2v1H3zM11 2h2v1h-2zM2 3h1v5H2zM13 3h1v5h-1zM6 5h4v1H6zM5 6h1v2H5zM10 6h1v2h-1zM6 8h4v1H6zM3 8h1v2H3zM12 8h1v2h-1zM4 10h1v2H4zM11 10h1v2h-1zM5 12h2v1H5zM9 12h2v1H9zM7 13h2v2H7z" />
    </svg>
  );
}

export function WalletIcon() {
  return (
    <svg {...pixel}>
      <path d="M2 2h10v1H2zM1 3h1v10H1zM12 3h1v2h-1zM2 5h12v1H2zM14 6h1v7h-1zM9 8h6v1H9zM9 9h1v2H9zM11 9h1v1h-1zM9 11h6v1H9zM2 13h12v1H2z" />
    </svg>
  );
}
