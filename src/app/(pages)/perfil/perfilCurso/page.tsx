"use client"

import cursoDAO from "@/DAOs/CursoDAO"
import Curso from "@/model/Curso"
import Turno from "@/model/Enums/Turno"
import { useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs"

interface ValorInput {
    nome: string,
    turno: string[]
}

export default function PerfilCurso() {
    const [curso, setCurso] = useState<Curso>(new Curso)
    const [valorInput, setValorInput] = useState<ValorInput>({
        nome: "",
        turno: [],
    })

    //PEGANDO ID DA ESCOLA QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            cursoDAO.getOne(id).then((cursoBuscado) => {
                setCurso(cursoBuscado)

                setValorInput({
                    nome: cursoBuscado.nome,
                    turno: cursoBuscado.turno
                })

            }).catch((e) => {
                console.log(e.message)
            })
        }

    }, [id])

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    function getCheckBox(event: ChangeEvent<HTMLInputElement>) {
        const { value, checked } = event.target;

        var turnoSelecionado: string = "";

        switch (value) {
            case "Matutino": {
                turnoSelecionado = Turno.MATUTINO
                break;
            }
            case "Vespertino": {
                turnoSelecionado = Turno.VESPERTINO
                break
            }
            case "Noturno": {
                turnoSelecionado = Turno.NOTURNO
                break
            }
        }


        // Verifica se o checkbox foi marcado ou desmarcado
        if (checked && !valorInput.turno.includes(turnoSelecionado)) {
            // Se foi marcado, adiciona o turno ao array
            setValorInput((prevState) => ({
                ...prevState,
                turno: [...prevState.turno, turnoSelecionado] // Adiciona o novo turno ao array
            }));
            console.log(valorInput.turno)
        } else {
            // Se foi desmarcado, remove o turno do array
            setValorInput((prevState) => ({
                ...prevState,
                turno: prevState.turno.filter(turno => turno !== turnoSelecionado) // Remove o turno do array
            }));
        }
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            console.log(`NOME: ${valorInput.nome}`)
            const cursoAtualizado = new Curso
            cursoAtualizado.nome = valorInput.nome
            cursoAtualizado.turno = valorInput.turno
            cursoAtualizado.escola = curso.escola

            await cursoDAO.update(id!, cursoAtualizado)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            await cursoDAO.deletar(curso.id)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    // Definir breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Escolas", href: "/listas/listaEscolas" },
        { label: curso.escola?.nome || "Escola", href: `/perfil/perfilEscola?id=${curso.escola?.id}` },
        { label: "Cursos", href: `/listas/listaCursos?idEscola=${curso.escola?.id}` },
        { label: curso.nome || "Perfil do Curso", isActive: true }
    ];

    return (
        <div className="w-full flex items-center flex-col px-4 py-10 min-h-screen bg-white">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-blue-100">
                <Breadcrumbs items={breadcrumbItems} />
                <button onClick={excluir} className="float-right text-lg mb-4 bg-red-500 py-2 px-6 text-white rounded-full hover:bg-red-600 transition-all duration-200">Excluir</button>
                <h1 className="text-2xl font-bold text-blue-700 mb-6">Perfil do Curso</h1>

                <form onSubmit={salvar} className="flex flex-col items-center h-full">


                <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.nome} />


                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Matutino" type="checkbox" checked={valorInput.turno.includes(Turno.MATUTINO)} />
                    <label className="" htmlFor="nome">Matutino</label>
                </div>

                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Vespertino" type="checkbox" checked={valorInput.turno.includes(Turno.VESPERTINO)} />
                    <label className="">Vespertino</label>
                </div>

                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Noturno" type="checkbox" checked={valorInput.turno.includes(Turno.NOTURNO)} />
                    <label className=""htmlFor="nome">Noturno</label>
                </div>

                <button type="submit" className="text-lg mt-10 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>

            </form>
            </div>
        </div>
    )
}