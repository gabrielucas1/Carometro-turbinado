import { ErroInputContext } from "@/app/context/ErroInputContext"
import useForm, { ErroState } from "@/hooks/useForm"
import { useContext } from "react"

interface PropsInput {
    placeholder: string
    id: keyof ErroState
    type: string
    autoComplete: string
    mensagemErro: string
}

export default function Input(props: PropsInput) {
    const { getInput } = useForm()

    const { erro } = useContext(ErroInputContext)
    const erroInput = erro[props.id]

    console.log(erroInput)

    return (
        <>
            <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id={props.id} type={props.type} placeholder={props.placeholder} autoComplete={props.autoComplete} />

            {
                erroInput
                    ? <p className="self-start text-red-600 text-sm">{props.mensagemErro}</p>
                    : null
            }
        </>
    )
}

export type { PropsInput }