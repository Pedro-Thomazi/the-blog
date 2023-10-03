import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>The Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.bgImage}>
        <div className={styles.introText}>
          <h2>Crie e Publique Blogs Incríveis com Facilidade</h2>
          <p>Você já teve uma ideia brilhante que desejava compartilhar com o mundo? Ou talvez queira estabelecer sua presença online e compartilhar suas paixões, conhecimentos ou histórias pessoais? Não procure mais! Nosso plataforma de criação e publicação de blogs é a solução perfeita para você.</p>
          <p>Neste projeto inovador, desenvolvi uma plataforma que capacita indivíduos e empresas a expressarem suas ideias, paixões e conhecimentos por meio de blogs. Com foco na simplicidade e na eficiência, esta plataforma oferece uma experiência intuitiva e agradável para criar e publicar conteúdo online.</p>
        </div>
        <Link className='btn' href='/publications'>Ver publicações</Link>
      </main>
    </>
  )
}