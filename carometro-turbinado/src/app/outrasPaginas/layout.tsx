import Image from "next/image"
import logo from '../../../public/images/Logo - CT.png'

export default function OutrasPaginasLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className="w-full bg-[#3579FF] h-14">
                <Image src={logo} alt='Logo do Carômetro Turbinado' width={80} height={0}></Image>
            </header>

            <main className="flex-grow flex justify-center bg-white">
                {children}  
            </main>
        </>
    )
}