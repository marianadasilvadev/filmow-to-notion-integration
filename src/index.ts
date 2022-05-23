import 'dotenv/config'
import { parse } from 'node-html-parser'
import fetch from 'node-fetch'
import { Notion } from './notion'
import readline from 'readline'
import { Medias } from './medias/medias'

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

readlineInterface.question('\nWhat is your username on Filmow? ', async (username: string) => {
  const userExists = await checkIfUserExists(username)
  if (!userExists) {
    readlineInterface.close()
    return
  }

  readlineInterface.question(
    `Select which type of media do you want to export from Filmow:
    1. Movies
    2. TV Shows
    3. Both\n`,
    async (option: string) => {
    if (option === '1') {
      await exportMovies(username)
    }

    if (option === '2') {
      await exportTvShows(username)
    }

    if (option === '3') {
      await exportMovies(username)
      await exportTvShows(username)
    }

    readlineInterface.close()
  })
});

const checkIfUserExists = async (username: string) => {
  const response = await fetch(`https://filmow.com/usuario/${username}`)

  if (response.statusText === 'OK') {
    const responseText = await response.text()
    const html = parse(responseText)
    const titleSection = html.querySelector('.title-section')

    if (titleSection && titleSection?.text.includes('Vixi! - Página não encontrada')) {
      console.log(`User ${username} not found.`)
      return false
    } else {
      return true
    }
  } else {
    console.log(`User ${username} not found.`)
    return false
  }
}

const exportMovies = async (username: string) => {
  const MoviesHandler = new Medias('movie', username)
  const wantToWatchMovies = await MoviesHandler.getWantToWatchMedias()
  const watchedMovies = await MoviesHandler.getWatchedMedias()
  const favoriteMovies = await MoviesHandler.getFavoriteMedias()

  const allMovies = [...watchedMovies, ...wantToWatchMovies, ...favoriteMovies]
  const filteredMovies = [...new Map(allMovies.map(movie => [movie['id'], movie])).values()]

  const NotionClient = new Notion()
  await NotionClient.createMediaDatabase('movie')

  for (const movie of filteredMovies) {
    await NotionClient.addMedia(movie)
  }
}

const exportTvShows = async (username: string) => {
  const TvShowHandler = new Medias('tvshow', username)
  const wantToWatchShows = await TvShowHandler.getWantToWatchMedias()
  const watchedShows = await TvShowHandler.getWatchedMedias()
  const favoriteShows = await TvShowHandler.getFavoriteMedias()

  const allShows = [...watchedShows, ...wantToWatchShows, ...favoriteShows]
  const filteredShows = [...new Map(allShows.map(media => [media['id'], media])).values()]

  const NotionClient = new Notion()
  await NotionClient.createMediaDatabase('tvshow')

  for (const media of filteredShows) {
    await NotionClient.addMedia(media)
  }
}
