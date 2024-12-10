import { Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ElementType } from "react";

interface NavButtonProps {
    href: string;
    icon: ElementType;
    text: string;
    ariaLabel: string;
}

export default function NavButton(props: NavButtonProps) {
    const router = useRouter();
    
    const handleClick = () => {
        router.push(props.href);
    }

    return (
        <button aria-label={props.ariaLabel} className="flex flex-col justify-center items-center group" onClick={handleClick}>
            <props.icon className="group-hover:hidden" size={34} />
            <props.icon weight="fill" className="hidden group-hover:block text-primary" size={34} />
            <p>{props.text}</p>
        </button>
    )
}
