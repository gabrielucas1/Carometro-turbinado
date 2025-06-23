"use client"

import escolaDAO from "@/DAOs/EscolaDAO"
import Escola from "@/model/Escola"
import { UserContext } from "@/contexts/UserContext"; // Importar o contexto do usuário
import TipoUsuario from "@/model/Enums/TipoUsuario"; // Importar os tipos de usuário
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useContext, useEffect, useState } from "react"

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

    return (
        <div className="w-full flex items-center flex-col px-96 h-full">
            <button onClick={btExcluir} className="fixed right-6 top-6 text-lg mt-14 mb-10 bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
            <h1 className="mt-4 text-2xl">Perfil da escola</h1>

            <form onSubmit={btSalvar} className="flex flex-col items-center h-full">


                <p className="mt-6 mb-1 self-start">Nome</p>
                <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.nome} />

                <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">CEP</p>
                        <input onChange={getInput} id="cep" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.cep} />
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Rua</p>
                        <input onChange={getInput} id="rua" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.rua} />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Bairro</p>
                        <input onChange={getInput} id="bairro" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.bairro} />
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Número da casa</p>
                        <input onChange={getInput} id="numeroCasa" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.numeroCasa} />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Complemento</p>
                        <input onChange={getInput} id="complemento" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.complemento} />
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Telefone</p>
                        <input onChange={getInput} id="telefone" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.telefone} />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Estado</p>
                        <input onChange={getInput} id="estado" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.estado} />
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Cidade</p>
                        <input onChange={getInput} id="cidade" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.cidade} />
                    </div>
                </div>

                <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Rede de Ensino</p>
                        <input onChange={getInput} id="rede" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.rede} />
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="mt-6 mb-1 self-start">Tipo de Ensino</p>
                        <input onChange={getInput} id="tipoEnsino" className="border-gray-400 p-1 border-2 rounded w-full h-11" value={valorInput.tipoEnsino} />
                    </div>
                </div>


                <button type="submit" className="fixed right-6 top-[81vh] text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>

            </form>
        </div>
    )
}