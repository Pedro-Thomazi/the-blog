import Link from 'next/link'
import styles from './header.module.css'

import { useSession, signIn, signOut } from 'next-auth/react'

import { BsList } from 'react-icons/bs'
import { useState } from 'react'


const Header = () => {
  const { data: session, status } = useSession()

  const [openMenu, setOpenMenu] = useState<string>('')
  const [openDiv, setOpenDiv] = useState<string>('')

  const showMenuList = () => {
    if (openMenu === '' && openDiv === '') {
      setOpenMenu(styles.show)
      setOpenDiv(styles.showDiv)
    }
    else {
      setOpenMenu('')
      setOpenDiv('')
    }

    console.log(openMenu)
  }

  console.log(openMenu)


  const userPhoto: any = session?.user?.image

  return (
    <>
      <header className={styles.headerHome}>
        <div className={styles.containerHeader}>
          <div className={styles.title}>
            <Link href='/'>
              <h1>The <span>Blog</span></h1>
            </Link>
          </div>
          <div className={styles.buttonLogin}>
            {status === 'loading' ? (
              <></>
            ) : session ? (
              <div className={styles.perfil}>
                <img src={userPhoto} alt="Foto" />
                <button className={styles.btnList} onClick={showMenuList}>
                  <BsList size={40} />
                </button>
                <div onClick={showMenuList} className={`${styles.divBackground} ${openDiv}`}></div>
                <ul className={`${styles.listLinks} ${openMenu}`}>
                  <li className={styles.name}>Olá, {session?.user?.name}</li>
                  <li><Link onClick={showMenuList} className={styles.links} href='/dashboard'>Meus Blogs</Link></li>
                  <li><Link onClick={showMenuList} className={styles.links} href='/publications'>Publicações</Link></li>
                  <li id={styles.btnOut}><button onClick={() => signOut()} className={styles.links}>Sair</button></li>
                </ul>

              </div>
            ) : (
              <button onClick={() => signIn('google')} className={styles.button}>Acessar</button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header