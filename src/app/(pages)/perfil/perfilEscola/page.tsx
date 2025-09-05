"use client"

import escolaDAO from "@/DAOs/EscolaDAO"
import Escola from "@/model/Escola"
import { UserContext } from "@/contexts/UserContext"; // Importar o contexto do usuário
import TipoUsuario from "@/model/Enums/TipoUsuario"; // Importar os tipos de usuário
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs"

export default function PerfilEscola() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { usuarioLogado, carregando } = useContext(UserContext); // Contexto do usuário

    //ESCOLA VAZIA PARA INICIALIZAR O ESTADO ESCOLA
    const escolaVazia: Escola = new Escola()

    //ESTADO ESCOLA PARA MOSTRAR DADOS NA TELA
    const [escola, setEscola] = useState<Escola>(escolaVazia)


    //ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState({
        nome: "",
        cep: "",
        rua: "",
        bairro: "",
        numeroCasa: "",
        estado: "",
        cidade: "",
        complemento: "",
        telefone: "",
        rede: "",
        tipoEnsino: "",
    })



    useEffect(() => {
        if (carregando) return; // Aguarde o carregamento do contexto do usuário

            console.log("IIIIIIIIIIIIIIIID capturado da URL:", id); // Log para verificar o ID

        if (!id) {
            console.error("ID da escola não foi passado na URL!");
            alert("Erro: ID da escola não encontrado!");
            router.push("/listas/listaEscolas");
            return;
        }

        if (
            usuarioLogado.tipoUsuario === TipoUsuario.FUNCIONARIO ||
            usuarioLogado.tipoUsuario === TipoUsuario.ADMESCOLA
        ) {
            if (usuarioLogado.escola.id !== id) {
                alert("Você não tem permissão para acessar esta escola!");
                router.push("/listas/listaEscolas");
                return;
            }
        }

        escolaDAO.getOne(id)
            .then((escolaRetornada) => {
                            console.log("Dados da escola carregados:", escolaRetornada); // Log para verificar os dados

                setEscola(escolaRetornada);
                setValorInput({
                    nome: escolaRetornada.nome,
                    cep: escolaRetornada.cep,
                    rua: escolaRetornada.rua,
                    bairro: escolaRetornada.bairro,
                    numeroCasa: escolaRetornada.numeroCasa,
                    estado: escolaRetornada.estado,
                    cidade: escolaRetornada.cidade,
                    complemento: escolaRetornada.complemento,
                    telefone: escolaRetornada.telefone,
                    rede: escolaRetornada.rede,
                    tipoEnsino: escolaRetornada.tipoEnsino,
                });
            })
            .catch((e) => {
                console.error("Erro ao carregar os dados da escola:", e.message);
            });
    }, [id, usuarioLogado, carregando])

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    async function btSalvar(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()

            console.log("ID da escola para atualização:", id); // Log para verificar o ID

        const algumCampoAlterado = escola.nome !== valorInput.nome ||
            escola.cep !== valorInput.cep || escola.rua !== valorInput.rua ||
            escola.bairro !== valorInput.bairro || escola.numeroCasa !== valorInput.numeroCasa ||   
            escola.estado !== valorInput.estado || escola.cidade !== valorInput.cidade ||
            escola.complemento !== valorInput.complemento || escola.telefone !== valorInput.telefone ||
            escola.rede !== valorInput.rede || escola.tipoEnsino !== valorInput.tipoEnsino


            if(!algumCampoAlterado){
                alert("Nenhum campo foi alterado!")
                router.push("/listas/listaEscolas")
                return;
            }


        const escolaAtualizada = new Escola();
        escolaAtualizada.nome = valorInput.nome
        escolaAtualizada.cep = valorInput.cep
        escolaAtualizada.rua = valorInput.rua
        escolaAtualizada.bairro = valorInput.bairro
        escolaAtualizada.numeroCasa = valorInput.numeroCasa
        escolaAtualizada.estado = valorInput.estado
        escolaAtualizada.cidade = valorInput.cidade
        escolaAtualizada.complemento = valorInput.complemento
        escolaAtualizada.telefone = valorInput.telefone
        escolaAtualizada.rede = valorInput.rede
        escolaAtualizada.tipoEnsino = valorInput.tipoEnsino

        try {
            await escolaDAO.update(id!, escolaAtualizada)
            alert("Escola atualizada com sucesso!")
            router.push("/listas/listaEscolas")
        } catch (e: any) {
            alert("Erro ao atualizar escola!")
            console.log(e.message)
        }

    }
    //

    async function btExcluir() {
        try {
            await escolaDAO.deletar(id!)
            alert("Escola excluída com sucesso!")
            // Redireciona para a tela de lista de escolas
            router.push("/listas/listaEscolas")
        } catch (e: any) {
            console.log(e.message)
        }
    }

    // Definir breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Escolas", href: "/listas/listaEscolas" },
        { label: escola.nome || "Perfil da Escola", isActive: true }
    ];

    return (
        <div className="w-full flex items-center flex-col px-4 py-10 min-h-screen bg-white">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-blue-100 animate-fade-in flex flex-col items-center">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                    Perfil da Escola
                </h1>
                {usuarioLogado.tipoUsuario === TipoUsuario.ADMGERAL ? (
                    <form onSubmit={btSalvar} className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome</label>
                                <input onChange={getInput} id="nome" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.nome} />
                            </div>
                            <div>
                                <label htmlFor="cep" className="block mb-2 text-lg font-semibold text-gray-700">CEP</label>
                                <input onChange={getInput} id="cep" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.cep} />
                            </div>
                            <div>
                                <label htmlFor="rua" className="block mb-2 text-lg font-semibold text-gray-700">Rua</label>
                                <input onChange={getInput} id="rua" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.rua} />
                            </div>
                            <div>
                                <label htmlFor="bairro" className="block mb-2 text-lg font-semibold text-gray-700">Bairro</label>
                                <input onChange={getInput} id="bairro" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.bairro} />
                            </div>
                            <div>
                                <label htmlFor="numeroCasa" className="block mb-2 text-lg font-semibold text-gray-700">Número</label>
                                <input onChange={getInput} id="numeroCasa" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.numeroCasa} />
                            </div>
                            <div>
                                <label htmlFor="complemento" className="block mb-2 text-lg font-semibold text-gray-700">Complemento</label>
                                <input onChange={getInput} id="complemento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.complemento} />
                            </div>
                            <div>
                                <label htmlFor="telefone" className="block mb-2 text-lg font-semibold text-gray-700">Telefone</label>
                                <input onChange={getInput} id="telefone" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.telefone} />
                            </div>
                            <div>
                                <label htmlFor="estado" className="block mb-2 text-lg font-semibold text-gray-700">Estado</label>
                                <input onChange={getInput} id="estado" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.estado} />
                            </div>
                            <div>
                                <label htmlFor="cidade" className="block mb-2 text-lg font-semibold text-gray-700">Cidade</label>
                                <input onChange={getInput} id="cidade" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.cidade} />
                            </div>
                            <div>
                                <label htmlFor="rede" className="block mb-2 text-lg font-semibold text-gray-700">Rede de Ensino</label>
                                <input onChange={getInput} id="rede" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.rede} />
                            </div>
                            <div>
                                <label htmlFor="tipoEnsino" className="block mb-2 text-lg font-semibold text-gray-700">Tipo de Ensino</label>
                                <input onChange={getInput} id="tipoEnsino" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.tipoEnsino} />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-4 justify-end">
                            <button onClick={btExcluir} type="button" className="bg-red-500 hover:bg-red-600 text-white py-2 px-8 rounded-full font-semibold shadow transition-all flex items-center gap-2">
                                <span>🗑️</span> Excluir
                            </button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full font-semibold shadow transition-all flex items-center gap-2">
                                <span>💾</span> Salvar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Nome</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.nome}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">CEP</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.cep}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Rua</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.rua}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Bairro</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.bairro}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Número</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.numeroCasa}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Complemento</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.complemento}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Telefone</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.telefone}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Estado</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.estado}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Cidade</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.cidade}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Rede de Ensino</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.rede}</span>
                            </div>
                            <div>
                                <span className="block mb-2 text-lg font-semibold text-gray-700">Tipo de Ensino</span>
                                <span className="block p-3 rounded-xl w-full bg-blue-50 text-gray-800 shadow-sm">{valorInput.tipoEnsino}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}