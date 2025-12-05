import React from "react";

interface ConselhoCardProps {
  nome: string;
  turma: string;
  data: string;
  hora: string; // Adicionado para exibir a hora
  onVerDetalhes: () => void;
  onGerarRelatorio: () => void;
}

const ConselhoCard: React.FC<ConselhoCardProps> = ({ nome, turma, data, hora, onVerDetalhes, onGerarRelatorio }) => {
  // Debug log para verificar se a hora está chegando
  console.log('[DEBUG] ConselhoCard - Props recebidas:', { nome, turma, data, hora });
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Informações principais */}
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <h3 className="font-bold text-xl text-gray-800">{nome}</h3>
          </div>
          
          <div className="space-y-2 ml-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium">Turma: {turma}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M7 21h10a1 1 0 001-1v-7a1 1 0 00-1-1H7a1 1 0 00-1 1v7a1 1 0 001 1z" />
              </svg>
              <span className="text-sm font-medium">Data: {data}</span>
            </div>
            
            {/* SEMPRE MOSTRA HORA PARA DEBUG */}
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Hora: {hora || "Não informada"}</span>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0 md:ml-6">
          <button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            onClick={onVerDetalhes}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver detalhes
          </button>
          
          <button 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            onClick={onGerarRelatorio}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConselhoCard;
