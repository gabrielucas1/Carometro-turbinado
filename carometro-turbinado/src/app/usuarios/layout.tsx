import Image from "next/image"
import logo from '../../../public/images/Logo - CT.png'
import Link from "next/link"

export default function HeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className="fixed w-full bg-[#3579FF] h-14">
                <Image src={logo} alt='Logo do Carômetro Turbinado' width={80} height={0} priority></Image>
            </header>

            <main className="flex-grow mt-14 flex justify-center bg-white">
                <div className="fixed left-0 w-28 h-full p-1 bg-blue-300">
                    <Link href={"/usuarios/admGeral/listaEscolas"}>
                        <button className="mt-6 w-full h-14 bg-red-500 flex items-center justify-center">Escolas</button>
                    </Link>

                    <Link href={"/usuarios/admGeral/listaFuncionarios"}>
                        <button className="mt-6 w-full h-14 bg-red-500 flex items-center">Funcionarios</button>
                    </Link>
                </div>
                <div className="ml-28 w-full">
                    {children}
                </div>
            </main>
        </>
    )
}