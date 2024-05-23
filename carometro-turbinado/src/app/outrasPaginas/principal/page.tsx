export default function Principal() {
    return (
        <main className="flex w-full flex-col items-center">
            <h1 className="mt-4 text-2xl">Escolas</h1>
            <div className="bg-blue-400 w-3/4 h-32 mt-14 p-4 flex flex-row">
                <div className="bg-red-500 h-full w-24 rounded-full"></div>
                <div className="ml-4">
                    <p>Escola exemplo</p>
                    <p>Rua tal</p>
                </div>
            </div>
        </main>
    )
}