import Head from 'next/head'
import styles from './publications.module.css'

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaRegComment, FaTrash } from 'react-icons/fa'

import { GetServerSideProps } from 'next/types'

import { db } from '@/server/firebaseConnection'

import { useSession } from 'next-auth/react'
import Textarea from '@/Components/Textarea'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import Link from 'next/link'


interface PostsProps {
  postId: string
  created: Date
  title: string
  text: string
  user: string
  comments: CommentsProps
}

interface CommentsProps {
  commentId: string
  comment: string
  postId: string
  user: string
  name: string
}

const Publications = () => {
  const [allPosts, setAllPosts] = useState<PostsProps[]>([])

  useEffect(() => {
    const loadAllPosts = async () => {
      const postsRef = collection(db, 'posts')
      
      const q = query(
        postsRef,
        orderBy('created', 'desc')
      )

      onSnapshot(q, (snapshot) => {
        let list = [] as PostsProps[]

        snapshot.forEach((doc) => {
          list.push({
            postId: doc.id,
            created: doc.data().created,
            title: doc.data().title,
            text: doc.data().text,
            user: doc.data().user,
            comments: doc.data().comments
          })
        })

        setAllPosts(list)
        console.log(allPosts)
      })
    }

    loadAllPosts()
  }, [])

  return (
    <div>
      <Head>
        <title>Publicações</title>
      </Head>

      <section className={styles.allPublications}>
        <h1 className={styles.title}>Publicações</h1>
        {allPosts.length === 0 && (
          <p className={styles.notPubli}>Não há publicações, seja você o primeiro. <Link href='/dashboard'>Criar Publicação</Link></p>
        )}

        {allPosts.map((item) => (
          <div key={item.postId} className={styles.publication}>
            <div className={styles.headerPubli}>
              <h2>{item.title}</h2>
              <div className={styles.user}>
                <h4>@{item.user}</h4>
              </div>
            </div>
            <p>{item.text}</p>
            <div className={styles.impressions}>
              <button><FaRegComment size={20} /></button>
              <button>
                <AiFillHeart size={20} color='#ee3124' />
                {/* <AiOutlineHeart size={20} /> */}
              </button>
            </div>
            <Link className={styles.addComment} href={`/post/${item.postId}`}>Ver mais</Link>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Publications