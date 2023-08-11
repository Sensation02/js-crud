const express = require('express')
const router = express.Router()
// ================================================================
class Track {
  static #list = []

  constructor(name, artist, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.artist = artist
    this.image = image
  }

  static create(name, artist, image) {
    const track = new Track(name, artist, image)
    this.#list.push(track)
    return track
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

// #region Track.create
Track.create(
  'Track 1',
  'Artist 1',
  'https://picsum.photos/600/600',
)
Track.create(
  'Track 2',
  'Artist 2',
  'https://picsum.photos/600/600',
)
Track.create(
  'Track 3',
  'Artist 3',
  'https://picsum.photos/600/600',
)
Track.create(
  'Track 4',
  'Artist 4',
  'https://picsum.photos/600/600',
)
Track.create(
  'Track 5',
  'Artist 5',
  'https://picsum.photos/600/600',
)
console.log(Track.getList())
// #endregion Track.create

class Playlist {
  // Список плейлистів
  static #list = []

  // конструктор який приймає назву плейліста
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = [] // список треків
    this.image = 'https://picsum.photos/600/600'
  }

  // статичний метод який створює плейліст та додає його в список плейлистів #list
  static create(name, image) {
    const playlist = new Playlist(name, image)
    this.#list.push(playlist)
    return playlist
  }

  // статичний метод який повертає список плейлистів
  static getList() {
    return this.#list.reverse()
  }

  // статичний метод який створює мікс
  static makeMix(playlist) {
    const mix = Track.getList()
    let randomTrack = mix
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // кладемо в наш плейліст випадкові треки
    playlist.tracks.push(...randomTrack)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById = (id) => {
    this.tracks = this.tracks.filter(
      (track) => track.id !== id,
    )
  }

  // метод додавання треків по id
  addTrackById = (id) => {
    const track = Track.getById(id)
    this.tracks.push(track)
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

// #region Playlist.create
Playlist.makeMix(Playlist.create('Favorites'))

Playlist.makeMix(Playlist.create('Mixed'))

Playlist.makeMix(Playlist.create('Random'))

Playlist.makeMix(Playlist.create('My playlist'))
// #endregion Playlist.create

// ================================================================
router.get('/', function (req, res) {
  allTracks = Track.getList()
  console.log(allTracks)

  const allPlaylists = Playlist.getList()
  console.log(allPlaylists)

  res.render('index', {
    style: 'index',

    data: {
      list: allPlaylists.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})
// ================================================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================
router.get('/spotify-choose', (req, res) => {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})
// ================================================================
router.get('/spotify-create', (req, res) => {
  const isMix = !!req.query.isMix
  console.log(isMix)
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})
router.post('/spotify-create', (req, res) => {
  const isMix = !!req.query.isMix
  const name = req.body.name
  console.log(name, !!isMix)
  if (!name) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Enter playlist name',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
        linkText: 'Create playlist',
      },
    })
  }

  const playlist = Playlist.create(name)
  if (isMix) {
    Playlist.makeMix(playlist)
  }
  console.log(playlist)

  res.render('spotify-alert', {
    style: 'spotify-alert',
    data: {
      message: 'Playlist created',
      link: `/spotify-playlist?id=${playlist.id}`,
      linkText: 'View playlist',
    },
  })
})
// ================================================================
router.get('/spotify-playlist', (req, res) => {
  const id = +req.query.id
  const playlist = Playlist.getById(+id)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Playlist not found',
        link: '/',
        linkText: 'Home',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-delete', (req, res) => {
  const playlistId = req.query.playlistId
  const trackId = req.query.trackId
  const playlist = Playlist.getById(+playlistId)
  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Playlist not found',
        link: '/',
        linkText: 'Home',
      },
    })
  }
  playlist.deleteTrackById(+trackId)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = +req.query.playlistId
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  console.log(playlistId)

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
      // link: `/spotify-track-add?playlistId=${playlistId}&trackId==${trackId}`,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  const playlistId = req.query.playlistId
  const trackId = req.query.trackId

  const playlist = Playlist.getById(+playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Playlist not found',
        link: `/spotify-playlist?playlistId=${playlistId}`,
        linkText: 'View playlist',
      },
    })
  }

  playlist.addTrackById(+trackId)
  console.log(playlist.tracks)
  if (!!playlist.addTrackById(+trackId)) {
    res.render('spotify-playlist', {
      style: 'spotify-playlist',
      data: {
        playlistId: playlist.id,
        tracks: playlist.tracks,
        name: playlist.name,
      },
    })
  }
})

// ================================================================
module.exports = router
