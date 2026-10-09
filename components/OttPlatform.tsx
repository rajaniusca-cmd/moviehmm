const logos: Record<string, string> = {
  "Netflix": "/ott-logos/netflix.svg",
  "Netflix (India)": "/ott-logos/netflix.svg",
  "Prime Video": "/ott-logos/prime-video.svg",
  "JioHotstar": "/ott-logos/jiohotstar.png",
  "Aha": "/ott-logos/aha.svg"
};

export default function OttPlatform({
  platform
}: {
  platform: string
}) {
  const names = platform
    .split("·")
    .map(x => x.trim())
    .filter(Boolean);

  return (
    <span className="ottPlatformList">
      {names.map(name => (
        <span className="ottPlatformItem" key={name}>
          {logos[name] && (
            <img
              src={logos[name]}
              alt=""
              aria-hidden="true"
            />
          )}
          <span>{name}</span>
        </span>
      ))}
    </span>
  );
}
