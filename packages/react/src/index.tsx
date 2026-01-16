interface IconToken {
  name: string;
  svg: string;
  viewBox: string;
  width: number;
  height: number;
}

interface IconProps {
  token: IconToken;
  className?: string;
  size?: number | string;
}

export function Icon({ token, className, size = 24 }: IconProps) {
  return (
    <svg
      viewBox={token.viewBox}
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      dangerouslySetInnerHTML={{ __html: token.svg }}
    />
  );
}

export type { IconToken };
