"use client"

import Image from "next/image"
import logo from '../../../public/images/Logo - CT.png'
import Link from "next/link"
import TipoUsuario from "@/model/Enums/TipoUsuario"
import React, { useContext } from "react"
import { UserContext } from "@/contexts/UserContext"

export default function OutrasPaginasLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { usuarioLogado, carregando } = useContext(UserContext)
    return (
        <>
            <header className="fixed w-full bg-[#3579FF] h-14">
                <Image src={logo} alt='Logo do Carômetro Turbinado' width={80} height={0} priority></Image>
            </header>


            <main className="flex-grow mt-14 flex justify-center bg-white">

                <div className="fixed left-0 w-28 h-full p-1 bg-blue-300">
                    {!carregando &&
                        <>
                            <Link href={"/outrasPaginas/listas/listaEscolas"}>
                                <button className="mt-6 w-full h-14 bg-red-500 flex items-center justify-center">Escolas</button>
                            </Link>

                            <Link href={usuarioLogado.tipoUsuario == TipoUsuario.ADMGERAL ? "/outrasPaginas/listas/listaADMEscola" : "/outrasPaginas/listas/listaFuncionarios"}>
                                <button className="mt-6 w-full h-14 bg-red-500 flex items-center">{usuarioLogado.tipoUsuario == TipoUsuario.ADMGERAL ? "ADM Escolas" : "Funcionarios"}</button>
                            </Link>
                        
                            {usuarioLogado.tipoUsuario == TipoUsuario.ADMESCOLA &&
                                <Link href={"/outrasPaginas/listas/listaCursos"}>
                                    <button className="mt-6 w-full h-14 bg-red-500 flex items-center justify-center">Cursos</button>
                                </Link>
                            }
                        </>
                    }
                    
                </div>
                <div className="ml-28 w-full">
                    {children}
                </div>
       
                
            </main>
            
            
        </>
    )
}