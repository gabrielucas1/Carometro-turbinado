"use client"

import Image from 'next/image';
import logo from '../../public/images/Logo - CT.svg'
import WelcomeImage from '../../public/images/WelcomeImage.svg'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-[#428AFF] h-16">
        <Image src={logo} alt='Logo do Carômetro Turbinado' width={90}></Image>
      </header>
      <main className="overflow-hidden w-full h-full bg-white flex flex-row gap-32 px-10 py-20">
        <div className='w-[520px]'>
          <h1 className='text-[#428AFF] font-bold text-5xl'>Bem-vindo</h1>
          <h2 className='mt-4 text-3xl text-amber-500'>ao Carômetro Turbinado</h2>
          <p className='mt-12 text-2xl text-gray-900'>
            Aqui você encontra uma solução prática, 
            fácil e confiável para ajudar a armazenar 
            e a disponibilizar informações dos
            estudantes. Está ponto para ter um 
            registro aprimorado?
          </p>
          <Link href={"/login"}>
            <button className="font-bold text-xl mt-12 bg-[#428AFF] py-3 px-8 text-white rounded-xl hover:px-10 transition-all duration-200">Comece agora</button>
          </Link>
        </div>
        <Image className='hidden md:block' src={WelcomeImage} height={0} width={620} alt='Imagem de uma formanda' priority></Image>
      </main>
    </div>
  )
}