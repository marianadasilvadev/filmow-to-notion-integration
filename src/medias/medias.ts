import { v4 as uuidv4 } from 'uuid'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import { Media, MediaStatus, MediaType } from './media'

export class Medias {
  username: string = ''
  mediaType: MediaType | null = null

  constructor(mediaType: MediaType, username: string) {
    this.username = username
    this.mediaType = mediaType
  }

  getBaseURL() {
    return `https://filmow.com/usuario/${this.username}/${this.mediaType === 'movie' ? 'filmes' : 'series'}`
  }

  async getWantToWatchMedias(): Promise<Media[]> {
    console.log(`GETTING WANT TO WATCH ${this.mediaType === 'movie' ? 'MOVIES' : 'TV SHOWS'}`)
    let page = 1
    let notFound = false
    const medias: Media[] = []

    while (!notFound) {
      const URL = `${this.getBaseURL()}/quero-ver/?pagina=${page}`

      const response = await fetch(URL)

      if (response.statusText === 'OK') {
        console.log(`Reading page ${page}`)

        const responseText = await response.text()
        const html = parse(responseText)
        const titleSection = html.querySelector('.title-section')

        if (titleSection && titleSection?.text.includes('Vixi! - Página não encontrada')) {
          notFound = true
        } else {
          const mediasList = html.querySelectorAll('.movie_list_item .wrapper')

          for (let media of mediasList) {
            const [imageWrapperEl, titleEl] = media.querySelectorAll('.cover.tip-movie')
            const imageEl = imageWrapperEl.querySelector('img')

            const id = imageWrapperEl?.getAttribute('data-movie-pk') || uuidv4()
            const title = titleEl?.getAttribute('title') || ''
            const image = imageEl?.getAttribute('data-src') || ''
            const score = null
            const status = MediaStatus.TO_WATCH
            const favorite = false

            medias.push(new Media(id, title, image, score, status, favorite))
          }
          page++
        }
      } else {
        notFound = true
      }
    }

    return medias
  }

  async getWatchedMedias(): Promise<Media[]> {
    console.log(`GETTING WATCHED ${this.mediaType === 'movie' ? 'MOVIES' : 'TV SHOWS'}`)
    let page = 1
    let notFound = false
    const medias: Media[] = []
  
    while (!notFound) {
      const URL = `${this.getBaseURL()}/ja-vi/?pagina=${page}`
  
      const response = await fetch(URL)
  
      if (response.statusText === 'OK') {
        console.log(`Reading page ${page}`)

        const responseText = await response.text()
        const html = parse(responseText)
        const titleSection = html.querySelector('.title-section')
  
        if (titleSection && titleSection?.text.includes('Vixi! - Página não encontrada')) {
          notFound = true
        } else {
          const mediasList = html.querySelectorAll('.movie_list_item .wrapper')
          const scoreList = html.querySelectorAll('.movie_list_item .user-rating')
  
          for (let m in mediasList) {
            const media = mediasList[m]
            const scoreWrapper = scoreList[m]
  
            const scoreEl = scoreWrapper.querySelector('.star-rating')
  
            const [imageWrapperEl, titleEl] = media.querySelectorAll('.cover.tip-movie')
            const imageEl = imageWrapperEl.querySelector('img')

            const id = imageWrapperEl?.getAttribute('data-movie-pk') || uuidv4()
            const title = titleEl?.getAttribute('title') || ''
            const image = imageEl?.getAttribute('data-src') || ''
            const score = scoreEl?.getAttribute('title') || ''
            const status = MediaStatus.WATCHED
            const favorite = false
  
            medias.push(new Media(id, title, image, score, status, favorite))
          }
  
          page++
        }
      } else {
        notFound = true
      }
    }
    return medias
  }

  async getFavoriteMedias(): Promise<Media[]> {
    console.log(`GETTING FAVORITE ${this.mediaType === 'movie' ? 'MOVIES' : 'TV SHOWS'}`)
    let page = 1
    let notFound = false
    const medias: Media[] = []
  
    while (!notFound) {
      const URL = `${this.getBaseURL()}/favoritos/?pagina=${page}`
  
      const response = await fetch(URL)
  
      if (response.statusText === 'OK') {
        console.log(`Reading page ${page}`)

        const responseText = await response.text()
        const html = parse(responseText)
        const titleSection = html.querySelector('.title-section')
  
        if (titleSection && titleSection?.text.includes('Vixi! - Página não encontrada')) {
          notFound = true
        } else {
          const mediasList = html.querySelectorAll('.movie_list_item .wrapper')
          const scoreList = html.querySelectorAll('.movie_list_item .user-rating')
  
          for (let m in mediasList) {
            const media = mediasList[m]
            const scoreWrapper = scoreList[m]
  
            const scoreEl = scoreWrapper.querySelector('.star-rating')
  
            const [imageWrapperEl, titleEl] = media.querySelectorAll('.cover.tip-movie')
            const imageEl = imageWrapperEl.querySelector('img')

            const id = imageWrapperEl?.getAttribute('data-movie-pk') || uuidv4()
            const title = titleEl?.getAttribute('title') || ''
            const image = imageEl?.getAttribute('data-src') || ''
            const score = scoreEl?.getAttribute('title') || ''
            const status = MediaStatus.WATCHED
            const favorite = true
  
            medias.push(new Media(id, title, image, score, status, favorite))
          }
  
          page++
        }
      } else {
        notFound = true
      }
    }
    return medias
  }
}
