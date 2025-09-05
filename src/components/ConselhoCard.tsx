import React from "react";

interface ConselhoCardProps {
  nome: string;
  turma: string;
  data: string;
  onVerDetalhes: () => void;
  onGerarRelatorio: () => void;
}

const ConselhoCard: React.FC<ConselhoCardProps> = ({ nome, turma, data, onVerDetalhes, onGerarRelatorio }) => {
  return (
    <div className="bg-blue-100 rounded-xl px-12 py-8 shadow flex flex-col md:flex-row md:items-center md:justify-between min-w-[400px] max-w-2xl mb-4">
      <div>
        <p className="font-bold text-lg">{nome}</p>
        <p className="text-sm">Turma: {turma}</p>
        <p className="text-sm">Data: {data}</p>
      </div>
         <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-12">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onVerDetalhes}>Ver detalhes</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onClick={onGerarRelatorio}>Gerar relatório</button>
      </div>
    </div>
  );
};

export default ConselhoCard;
