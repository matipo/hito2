interface IconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  onClick?: () => void;
  fill?: string;
}

export const Gamepad = (props: IconProps) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 640"
        width={props.width || 24} 
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path 
      fill="#673ab8" 
      d="M448 128C554 128 640 214 640 320C640 426 554 512 448 512L192 512C86 512 0 426 0 320C0 214 86 128 192 128L448 128zM192 240C178.7 240 168 250.7 168 264L168 296L136 296C122.7 296 112 306.7 112 320C112 333.3 122.7 344 136 344L168 344L168 376C168 389.3 178.7 400 192 400C205.3 400 216 389.3 216 376L216 344L248 344C261.3 344 272 333.3 272 320C272 306.7 261.3 296 248 296L216 296L216 264C216 250.7 205.3 240 192 240zM432 336C414.3 336 400 350.3 400 368C400 385.7 414.3 400 432 400C449.7 400 464 385.7 464 368C464 350.3 449.7 336 432 336zM496 240C478.3 240 464 254.3 464 272C464 289.7 478.3 304 496 304C513.7 304 528 289.7 528 272C528 254.3 513.7 240 496 240z"
    />
    </svg>
);

export const Arrowright = (props: IconProps)=> (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path 
        fill="#673ab8" 
        d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
    />
    </svg>
);
export const Facelaugh = (props: IconProps)=> (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill="#673ab8" d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM165.6 378C161.9 364.3 173.1 352 187.3 352L452.7 352C466.9 352 478.1 364.3 474.4 378C455.9 446 393.8 496 320 496C246.2 496 184 446 165.6 378zM208 256C208 238.3 222.3 224 240 224C257.7 224 272 238.3 272 256C272 273.7 257.7 288 240 288C222.3 288 208 273.7 208 256zM400 224C417.7 224 432 238.3 432 256C432 273.7 417.7 288 400 288C382.3 288 368 273.7 368 256C368 238.3 382.3 224 400 224z"/></svg>
);

export const CartIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M230.4 432C198.4 432 172.8 457.6 172.8 489.6C172.8 521.6 198.4 547.2 230.4 547.2C262.4 547.2 288 521.6 288 489.6C288 457.6 262.4 432 230.4 432zM480 432C448 432 422.4 457.6 422.4 489.6C422.4 521.6 448 547.2 480 547.2C512 547.2 537.6 521.6 537.6 489.6C537.6 457.6 512 432 480 432zM565.6 128L563.2 128L499.2 294.4C492.8 310.4 476.8 320 460.8 320L236.8 320C217.6 320 201.6 310.4 195.2 294.4L96 96L44.8 96C27.2 96 12.8 81.6 12.8 64C12.8 46.4 27.2 32 44.8 32L115.2 32C128 32 140.8 40 144 52.8L176 128L565.6 128ZM460.8 256L524.8 192L192 192L236.8 256L460.8 256Z"/>
    </svg>
);

export const XIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M425.6 320L572.8 172.8C585.6 160 585.6 140.8 572.8 128C560 115.2 540.8 115.2 528 128L320 336L112 128C99.2 115.2 80 115.2 67.2 128C54.4 140.8 54.4 160 67.2 172.8L214.4 320L67.2 467.2C54.4 480 54.4 499.2 67.2 512C80 524.8 99.2 524.8 112 512L320 304L528 512C540.8 524.8 560 524.8 572.8 512C585.6 499.2 585.6 480 572.8 467.2L425.6 320Z"/>
    </svg>
);

export const HeartIcon = (props: IconProps & { filled?: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.filled ? (props.fill || "#c084fc") : "none"} stroke={props.fill || "#673ab8"} stroke-width="32" d="M320 544C312 544 304 541.6 297.6 536L275.2 516.8C160 412.8 83.2 344 83.2 260.8C83.2 193.6 137.6 140.8 204.8 140.8C241.6 140.8 276.8 158.4 300.8 184.8L320 204L339.2 184.8C363.2 158.4 398.4 140.8 435.2 140.8C502.4 140.8 556.8 193.6 556.8 260.8C556.8 344 480 412.8 364.8 516.8L342.4 536C336 541.6 328 544 320 544Z"/>
    </svg>
);

export const PlusIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M352 128L352 288L512 288C529.6 288 544 302.4 544 320C544 337.6 529.6 352 512 352L352 352L352 512C352 529.6 337.6 544 320 544C302.4 544 288 529.6 288 512L288 352L128 352C110.4 352 96 337.6 96 320C96 302.4 110.4 288 128 288L288 288L288 128C288 110.4 302.4 96 320 96C337.6 96 352 110.4 352 128Z"/>
    </svg>
);

export const MinusIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M512 288C529.6 288 544 302.4 544 320C544 337.6 529.6 352 512 352L128 352C110.4 352 96 337.6 96 320C96 302.4 110.4 288 128 288Z"/>
    </svg>
);

export const TrashIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M496 128L435.2 128L416 96C408 80 392 64 368 64L272 64C248 64 232 80 224 96L204.8 128L144 128C126.4 128 112 142.4 112 160C112 177.6 126.4 192 144 192L496 192C513.6 192 528 177.6 528 160C528 142.4 513.6 128 496 128ZM176 496C176 531.2 204.8 560 240 560L400 560C435.2 560 464 531.2 464 496L464 224L176 224L176 496Z"/>
    </svg>
);

export const CheckIcon = (props: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={props.width || 24}
        height={props.height || 24}
        className={props.className}
        onClick={props.onClick}
    >
    <path fill={props.fill || "#673ab8"} d="M544 128C531.2 128 518.4 132.8 508.8 140.8L256 393.6L131.2 268.8C108.8 246.4 72 246.4 49.6 268.8C27.2 291.2 27.2 328 49.6 350.4L214.4 515.2C236.8 537.6 273.6 537.6 296 515.2L579.2 232C601.6 209.6 601.6 172.8 579.2 150.4C569.6 137.6 556.8 128 544 128Z"/>
    </svg>
);
