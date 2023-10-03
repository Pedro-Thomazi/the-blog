import styles from './post.module.css'

import Head from 'next/head'

import { db } from '@/server/firebaseConnection'
import { collection, query, doc, where, getDoc, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

import { ChangeEvent, FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'

import Textarea from '../../Components/Textarea/index'
import { FaRegComment, FaTrash } from 'react-icons/fa'

import { GetServerSideProps } from 'next'
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from 'react-icons/ai'
import { BsFillPencilFill, BsTrash3Fill } from 'react-icons/bs'

interface PostProps {
  item: {
    title: string
    text: string
    created: string
    user: string
    postId: string
  }
  allComments: CommentsProps[]
}

interface CommentsProps {
  id: string
  comment: string
  postId: string
  user: string
  name: string
}

const Post = ({ item, allComments }: PostProps) => {
  const { data: session } = useSession()


  const [showForm, setShowForm] = useState<string>('')
  const [input, setInput] = useState<string>('')
  const [comments, setComments] = useState<CommentsProps[]>(allComments || [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (input === '') return
    if (!session?.user?.email || !session?.user?.name) return

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        postId: item?.postId
      })

      const data = {
        id: docRef.id,
        comment: input,
        postId: item?.postId,
        user: session?.user?.email,
        name: session?.user?.name,
      }

      setComments((oldItems) => [...oldItems, data])

      setInput('')
    } catch (error) {
      console.log(error)
    }
  }

  const openFormComment = () => {
    if (showForm === '') {
      setShowForm(styles.show)
    }

    else {
      setShowForm('')
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      const docRef = doc(db, 'comments', id)
      await deleteDoc(docRef)

      const deleteComment = comments.filter((item) => item.id !== id)

      setComments(deleteComment)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div >
      <Head>
        <title>{item.title}</title>
      </Head>

      <main className={styles.containerMain}>
        <section className={styles.post}>
          <h1>Post de <span className={styles.name}>{item.user}</span></h1>
          <article>
            <header className={styles.headerPubli}>
              <h2>{item.title}</h2>
              <div className={styles.user}>
                <span>{item.user}</span>
              </div>
            </header>
            <p>{item.text}</p>
            <div className={styles.impressions}>
              <button onClick={openFormComment}><FaRegComment size={20} /></button>
              <button>
                <AiFillHeart size={20} color='#ee3124' />
                {/* <AiOutlineHeart size={20} /> */}
              </button>
            </div>
          </article>
        </section>

        <section className={styles.comments}>
          <div className={styles.myComment}>
            <button disabled={!session?.user}
              onClick={openFormComment}
              className={styles.addComment}>Adicionar Comentario</button>
            <form onSubmit={handleSubmit} className={`${showForm}`}>
              <Textarea value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder='Adicionar comentário...' />
              <button className={styles.btnComment}>Comentar</button>
            </form>
          </div>

          <article className={styles.allComments}>
            {comments.length === 0 && (
              <h2 className={styles.noHaveComments}>Não há comentários. Seja você o primeiro!</h2>
            )}

            {comments.map((item) => (
              <div key={item.id} className={styles.comment}>
                <header>
                  <span>@{item.name}</span>
                  {item.user === session?.user?.email && (
                    <button onClick={() => handleDeleteComment(item.id)} className={styles.btnDeleteComment}>
                      <FaTrash size={20} />
                    </button>
                  )}
                </header>
                <p>{item.comment}</p>
                <div className={styles.impressions}>
                  <span>
                    <AiFillHeart size={20} color='#ee3124' />
                    {/* <AiOutlineHeart size={20} />1.515 */}
                  </span>
                </div>
              </div>
            ))}
          </article>
        </section>
      </main>
    </div>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string

  const docRef = doc(db, 'posts', id)
  const q = query(collection(db, 'comments'), where('postId', '==', id))
  const snapshotComments = await getDocs(q)

  let allComments: CommentsProps[] = []
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      postId: doc.data().postId,
      user: doc.data().user,
      name: doc.data().name
    })
  })

  console.log(allComments)

  const snapshot = await getDoc(docRef)

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000

  const post = {
    title: snapshot.data()?.title,
    text: snapshot.data()?.text,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    postId: id
  }

  console.log(post)

  return {
    props: {
      item: post,
      allComments: allComments,
    }
  }
}