
interface AlunoCardConselhoProps {
  aluno: any;
  comentarios: any[];
  comentarioEdicao: string;
  onChangeComentario: (valor: string) => void;
  salvando?: boolean;
}

export default function AlunoCardConselho({ aluno, comentarios, comentarioEdicao, onChangeComentario, salvando }: AlunoCardConselhoProps) {
  return (
    <div className="flex gap-4 items-start w-full">
      <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
        <div className="flex w-full cursor-pointer">
          <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
            <img 
              src={aluno.fotoUrl} 
              width={80} 
              height={80}
              className="w-full h-full object-cover rounded-lg" 
              alt={`Foto do Aluno ${aluno.nome}`} 
            />
          </div>
          <div className="px-3 flex flex-col justify-center text-start h-full py-1">
            <p className="text-xl font-semibold">{aluno.nome}</p>
            <p className="text-sm text-gray-600">{aluno.dataNascimento}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-lg">
        <textarea
          className="w-full border rounded p-2 h-32"
          value={comentarioEdicao}
          onChange={e => onChangeComentario(e.target.value)}
          placeholder="Digite o comentário para o aluno"
          disabled={salvando}
        />
      </div>
    </div>
  );
}
