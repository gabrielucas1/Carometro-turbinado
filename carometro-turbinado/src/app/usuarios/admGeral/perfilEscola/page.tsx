"use client"

import { useSearchParams } from "next/navigation"

export default function PerfilEscola() {
    const searchParams = useSearchParams()

    const id = searchParams.get('id')

    return (
        <div className="w-full flex justify-center">
            <h1>{`O ID É ${id}`}</h1>
        </div>
    )
}