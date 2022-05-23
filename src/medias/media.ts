export enum MediaStatus {
  WATCHED ='Watched',
  TO_WATCH ='To Watch'
}

export type MediaType = 'movie' | 'tvshow'

export class Media {
  id: string
  title: string = ''
  image: string = ''
  score: string | null = null
  status: MediaStatus | null = null
  favorite: boolean = false
  
  constructor(id: string, title: string, image: string, score: string | null, status: MediaStatus, favorite: boolean) {
    this.id = id
    this.title = title
    this.image = image
    this.score = this.getScore(score)
    this.status = status
    this.favorite = favorite
  }

  getScore(score: string | null = ''): string | null {
    if (score) {
      const scoreArray = score.split(' ')
      const scoreNumber = Number(scoreArray[1])
      
      let scoreStar = ''
      for (let i = 0; i < scoreNumber; i++)
        scoreStar += '⭐'

      return scoreStar
    }

    return null
  }
}