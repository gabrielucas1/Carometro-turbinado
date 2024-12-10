"use client"

import Image from 'next/image'
import Logo from '../../../public/images/Logo - CT.svg'
import TipoUsuario from "@/model/Enums/TipoUsuario"
import React, { useContext } from "react"
import { UserContext } from "@/contexts/UserContext"
import { Student, GraduationCap, UsersThree, DownloadSimple} from "@phosphor-icons/react";
import NavButton from "@/components/NavButton"

export default function OutrasPaginasLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { usuarioLogado, carregando } = useContext(UserContext)
    return (
        <>
            <header className="fixed w-full bg-[#3579FF] h-14">
                <Image src={Logo} alt='Logo do Carômetro Turbinado' width={85}></Image>
            </header>


            <main className="flex-grow mt-14 flex justify-center">
   
                {!carregando && 
                <>
                    <div className="fixed left-0 flex flex-col gap-8 pt-6 w-28 h-full p-1 border-r-2 border-gray-900">
                    {usuarioLogado.tipoUsuario == TipoUsuario.ADMESCOLA && (
                        <NavButton href="/listas/listaCursos" icon={Student} text="Alunos" ariaLabel='Ver Cursos'/>
                    )}

                    <NavButton href="/listas/listaEscolas" icon={GraduationCap} text="Escolas" ariaLabel='Ver Escolas'/>

                    <NavButton
                        href={
                            usuarioLogado.tipoUsuario == TipoUsuario.ADMGERAL
                                ? "/listas/listaADMEscola"
                                : "/listas/listaFuncionarios"
                        }
                        icon={UsersThree}
                        text="Equipe"
                        ariaLabel={usuarioLogado.tipoUsuario == TipoUsuario.ADMGERAL
                        ? "Ver Administradores de Escola"
                        : "Ver Funcionários"}
                    />

                    {usuarioLogado.tipoUsuario == TipoUsuario.ADMESCOLA && (
                        <NavButton href="/importarAluno" icon={DownloadSimple} text="Importar" ariaLabel='Importar Aluno'/>
                    )}

                    </div>
                    <div className="ml-28 w-full flex flex-col items-center">
                        {children}
                    </div>
                
                </>
            }               
            </main>
        </>
    )
}