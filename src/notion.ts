import { Client } from '@notionhq/client'
import { Media, MediaType, MediaStatus } from './medias/media'

const notion = new Client({ auth: process.env.NOTION_KEY })

const parentId: string = process.env.NOTION_PARENT_DATABASE_KEY || ''

export class Notion {
  client: any
  database: any

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_KEY })
  }

  async createMediaDatabase(mediaType: MediaType) {
    try {
      const response = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentId
        },
        icon: {
          type: 'emoji',
          emoji: '🎥'
        },
        cover: {
          type: 'external',
          external: {
            url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1'
          }
        },
        title: [
          {
            'type': 'text',
            'text': {
              'content': `${mediaType === 'movie' ? 'Movies' : 'Tv Shows'} (from the Filmow to Notion integration)`,
              'link': null
            }
          }
        ],
        properties: {
          'Name': {
            title: {}
          },
          'Status': {
            select: {
              options: [{
                color: 'purple',
                name: MediaStatus.TO_WATCH
              }, {
                color: 'yellow',
                name: MediaStatus.WATCHED
              }]
            }
          },
          'Score 1/5': {
            select: {
              options: [{
                color: 'gray',
                name: '⭐'
              }, {
                color: 'gray',
                name: '⭐⭐'
              }, {
                color: 'gray',
                name: '⭐⭐⭐'
              }, {
                color: 'gray',
                name: '⭐⭐⭐⭐'
              }, {
                color: 'gray',
                name: '⭐⭐⭐⭐⭐'
              }]
            }
          },
          'Favorite': {
            type: 'checkbox',
            checkbox: {}
          }
        }
      })
      this.database = response
      console.log('Media database created successfully')
    } catch (error) {
      console.log('It was not possible to create the Media database')
    }
  }

  async addMedia(media: Media) {
    try {
      await notion.pages.create({
        parent: { database_id: this.database.id },
        cover: {
          type: 'external',
          external: {
            url: media.image
          }
        },
        icon: {
          type: 'emoji',
          emoji: media.favorite ? '❤️' : '🎬'
        },
        properties: {
          Name: {
            // @ts-ignore
            title: [
              {
                text: {
                  content: media.title
                }
              }
            ]
          },
          // @ts-ignore
          'Score 1/5': media.score ? {
            // @ts-ignore
            select: {
              name: media.score,
            }
          } : undefined,
          // @ts-ignore
          'Status': media.status ? {
            // @ts-ignore
            select: {
              name: media.status,
            }
          } : undefined,
          'Favorite': {
            // @ts-ignore
            "checkbox": media.favorite
          }
        },
      })
      console.log('Success! Entry added. Movie name: ' + media.title)
    } catch (error) {
      console.error(error)
    }
  }
}
