"use client"

import Image from 'next/image';
import logo from '../../public/images/Logo - CT.png'
import formanda from '../../public/images/Formanda - IA - Carômetro Trubinado.png'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-[#3579FF] h-14">
        <Image src={logo} alt='Logo do Carômetro Turbinado' width={80} height={0}></Image>
      </header>
      <main className="overflow-hidden pl-5 w-full bg-white flex-1 flex flex-row">
        <div>
          <h1 className='mt-11 text-[#3579FF] font-bold text-5xl'>Bem-vindo</h1>
          <p className='pr-24 mt-12 text-2xl'>
            Aqui no Carômetro Turbinado, você
            encontra uma solução prática, fácil
            e confiável para ajudar a armazenar e
            a disponibilizar informações dos estudantes.
            Está ponto para ter um registro aprimorado?
          </p>
          <Link href={"/login"}>
            <button className="font-bold text-xl mt-12 bg-[#3579FF] py-3 px-8 text-white rounded-full hover:px-10 transition-all duration-200">Comece agora</button>
          </Link>
        </div>
        <Image className='hidden md:block' src={formanda} height={0} width={700} alt='Imagem de uma formanda' priority></Image>
      </main>
    </div>
  )
}