import Head from 'next/head'
import styles from './dashboard.module.css'
import Textarea from '@/Components/Textarea'

import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GetServerSideProps, GetStaticProps } from 'next'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

// Icons
import { FaRegComment, FaTrash } from 'react-icons/fa'
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai'
import { BsFillPencilFill, BsTrash3Fill } from 'react-icons/bs'


// Firebase
import { db } from '@/server/firebaseConnection'
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc, getDocs, } from 'firebase/firestore'

interface HomeProps {
  user: {
    email: string
  }
}

interface PostsProps {
  id: string
  created: Date
  title: string
  text: string
  user: string
}


const Dashboard = ({ user }: HomeProps) => {

  const [title, setTitle] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [posts, setPosts] = useState<PostsProps[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        orderBy('created', 'desc'),
        where('user', '==', user?.email)
      )

      onSnapshot(q, (snapshot) => {
        let list = [] as PostsProps[]

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            title: doc.data().title,
            text: doc.data().text,
            user: doc.data().user,
          })
        })

        setPosts(list)
      })
    }

    loadPosts()
  }, [user?.email])

  const { data: session } = useSession()

  const userPhoto: any = session?.user?.image

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const btnCancel = () => {
    setTitle('')
    setText('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (title === '') return
    if (text === '') return

    try {
      await addDoc(collection(db, 'posts'), {
        text: text,
        title: title,
        created: new Date(),
        user: user?.email,
      })

      setText('')
      setTitle('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePost = async (id: string) => {
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
  }

  return (
    <div>
      <Head>
        <title>Minhas publicaçãoes</title>
      </Head>

      <section className={styles.containerCreate}>
        <h1>Crie e seu Publique seu Blog</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formTitle}>
            <label>Título:</label>
            <input onChange={handleTitle}
              type="text"
              name="title"
              id="title"
              placeholder='Digite um texto...'
              value={title}
              required />
          </div>
          <div className={styles.formTextarea}>
            <Textarea onChange={handleText}
              placeholder='Escreva sua Ideia...'
              value={text}
              required />
          </div>

          <div className={styles.buttons}>
            <button type='submit' className={`${styles.btn} ${styles.btnPublic}`}>Publicar</button>
            <button onClick={btnCancel} className={`${styles.btn} ${styles.btnCancel}`}>Cancelar</button>
          </div>
        </form>
      </section>

      <section className={styles.containerMyPubli}>
        <main className={styles.main}>
          <h1>Minhas Publicações</h1>
          {posts.map((item) => (
            <div key={item.id} className={styles.publication}>
              <div className={styles.headerPubli}>
                <h2>{item.title}</h2>
                <div className={styles.user}>
                  <img src={userPhoto} alt="Foto" />
                  <h4>@{item.user}</h4>
                </div>
              </div>
              <p>{item.text}</p>
              <div className={styles.configurations}>
                <div className={styles.impressions}>
                  <span><FaRegComment size={20} /></span>
                  <span>
                    <AiFillHeart size={20} color='#ee3124' />
                    {/* <AiOutlineHeart size={20} /> */}
                  </span>
                </div>
                <div className={styles.btnUpdateDelete}>
                  <Link href={`/post/${item.id}`}><AiOutlineSearch />Ver Post</Link>
                  <button onClick={() => handleDeletePost(item.id)} className={styles.btnDelete}><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </section>
    </div>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session = await getSession({ req })
  // console.log(session)

  if (!session?.user) {
    // Se nao tem usuario vamos redirecionar para home
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      user: {
        email: session?.user?.email
      }
    }
  }
}