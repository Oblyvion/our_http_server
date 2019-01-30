define({ "api": [
  {
    "type": "post",
    "url": "/collabs/:playlistID",
    "title": "Fügt einen neuen Collaborator zu der Playlist mit der angegebenen ID hinzu.",
    "name": "PostAddCollaboratorToPlaylist",
    "group": "COLLABORATOR",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "playlistID",
            "description": "<p>Playlists unique PLAYLISTS ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mate",
            "description": "<p>Users unique USERS NAME</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Playlist",
            "description": "<p>Mate Anfrage</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n  \"success\": true,\n  \"msg\": \"Collaborator heinz has been added to your account successfully.\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Der",
            "description": "<p>angefrage Playlist Mate ist bereits ein Collaborator der aktuellen Playlist</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'The Playlist Mate -> ' + req.body.mate + ' <- is one of your Collaborators already.\n Invite another Playlist Mate to your Playlist.'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'The Playlist Mate -> ' + req.body.mate + ' <- is one of your Collaborators already.\n Invite another Playlist Mate to your Playlist.'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Sorry for that. This should not happening.'\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n       {\n \"success\": false,\n \"msg\": \"You are not authorized for this action.\",\n \"err\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "COLLABORATOR"
  },
  {
    "type": "get",
    "url": "/init",
    "title": "Datenbank wird initialisiert",
    "name": "GetInit",
    "group": "INIT_DB",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Initialisierung",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n success: true,\n msg: 'db ready to use'\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Initialisierungsfehler",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "   HTTP/1.1 404 Not Found\n\n{\n  success: false,\n  msg: 'db init error'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "INIT_DB"
  },
  {
    "type": "get",
    "url": "/playlists/collabs",
    "title": "Gibt die Playlists von den Collaborators des aktuellen Users zurück.",
    "name": "GetPlaylistsOfCollaborators",
    "group": "PLAYLIST",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Collaborator",
            "description": "<p>Playlists gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"data\": [\n     {\n         \"ID\": 1,\n         \"NAME\": \"Playlist 1\"\n     },\n     {\n         \"ID\": 4,\n         \"NAME\": \"Playlist 4\"\n     }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Keine",
            "description": "<p>Collaborator Playlists gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {success: false, msg: 'Found no collaborator playlists.', err: err}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST"
  },
  {
    "type": "get",
    "url": "/playlists",
    "title": "Gibt die Playlists vom aktuellen User zurück.",
    "name": "GetPlaylistsOfUser",
    "group": "PLAYLIST",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Playlists",
            "description": "<p>gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"data\": [\n     {\n         \"ID\": 2,\n         \"NAME\": \"Playlist 1\",\n         \"USER_ID\": 2\n     }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Kein",
            "description": "<p>Playlist gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n  {\n  success: false,\n  msg: 'Found no playlists.',\n  err: err\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST"
  },
  {
    "type": "post",
    "url": "/playlist",
    "title": "Erstellt eine neue Playlist mit dem aktuell angemeldeten User als Besitzer",
    "name": "PostPlaylist",
    "group": "PLAYLIST",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>PLAYLISTS NAME.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Playlist",
            "description": "<p>hinzugefügt</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\nsuccess: true,\nmsg: 'Playlist created successfully.',\ndata: playlist\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n   {\n   success: false,\n   msg: 'Cannot insert playlists at this time.',\n   err: err\n   }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n success: false,\n msg: 'You are not authorized for this action.',\n err: err\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST"
  },
  {
    "type": "get",
    "url": "/playlistMates/sharedPlaylists/:mate",
    "title": "Gibt die Anzahl an geteilten Playlists mit dem Mate zurück.",
    "name": "GetCountPlaylistsSharedWithMate",
    "group": "PLAYLIST_MATE",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mate",
            "description": "<p>USERS unique USERS NAME.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Anzahl",
            "description": "<p>an geteilten Playlists mit Collaborator ermittelt</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"data\": {\n     \"countSharedPlaylists\": 0\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'The counter feels tired right now.',\n err: err\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n  {\n  success: false,\n  msg: 'You are not authorized for this action or no mates are available.',\n  err: err\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST_MATE"
  },
  {
    "type": "get",
    "url": "/playlistMates",
    "title": "Gibt die Playlist Mates vom aktuellen User zurück",
    "name": "GetPlaylistMates",
    "group": "PLAYLIST_MATE",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Playlist",
            "description": "<p>Mates vorhanden und gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n  {\n\"success\": true,\n\"data\": [\n            {\n           \"NAME\": \"test\",\n           \"SCORE\": 10,\n           \"REQUEST\": 1\n           }\n        ]\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Keine",
            "description": "<p>Playlist Mates gefunden.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Nothing in there, yet.',\n err: err\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\nsuccess: false,\nmsg: 'You are not authorized for this action.',\nerr: err\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Sorry, this could be better.',\n err: err\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST_MATE"
  },
  {
    "type": "post",
    "url": "/playlistMate",
    "title": "Fügt einen neuen Playlist Mate seinem User-Account hinzu",
    "name": "PostPlaylistMate",
    "group": "PLAYLIST_MATE",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mate",
            "description": "<p>Users unique USERS NAME</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Playlist",
            "description": "<p>Mate Anfrage</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n \"success\": true,\n \"msg\": \"Playlist Mate request send to sigmuel successfully.\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Der",
            "description": "<p>angefrage User ist bereits ein Playlist Mate vom aktuellen User</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"success\": false,\n \"msg\": \"The user -> sigmuel <- is your Playlist Mate already. Hire another User.\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n   {\n   success: false,\n   msg: 'You are not authorized to add new Playlist Mate.',\n   err: err\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST_MATE"
  },
  {
    "type": "post",
    "url": "/playlistMates/request",
    "title": "Akzeptiert oder verweigert einen Playlist Mate Request",
    "name": "PostPlaylistMatesRequest",
    "group": "PLAYLIST_MATE",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "playlistID",
            "description": "<p>Playlists unique PLAYLISTS ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mate",
            "description": "<p>Users unique USERS NAME</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Verweigere",
            "description": "<p>Playlist Mate Request</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "best",
            "description": "<p>ätige Playlist Mate Request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   {\n   success: true,\n   msg: 'Decline Playlist Mate Request: Playlist Mate deleted!'\n   }",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n \"success\": true,\n \"msg\": \"User test and you are Playlist Mates now.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "verweigern",
            "description": "<p>vom Playlist Mate Request fehlgeschlagen</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "gew",
            "description": "<p>ünschter Playlist Mate konnte nicht gefunden werden</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"success\": false,\n \"msg\": \"Delete from Playlist Mates failed.\",\n \"err\": {}\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n   {\n   success: false,\n   msg: 'Cannot find such Playlist Mate. Add user as Playlist Mate first!',\n   err: err\n   }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n \"success\": false,\n \"msg\": \"You are not authorized for this action!\",\n \"err\": {}\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "PLAYLIST_MATE"
  },
  {
    "type": "get",
    "url": "/songs",
    "title": "Gibt alle Songs zurück",
    "name": "GetSongs",
    "group": "SONG",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Songs",
            "description": "<p>gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"data\": [\n     {\n         \"ID\": 1,\n         \"TITLE\": \"Beispiel Title 1\",\n         \"ARTIST\": \"Beispiel Artist 1\",\n         \"ADDED_BY\": 1,\n         \"PATH\": \"PATHBliBlaBlubbb\"\n     },\n     {\n         \"ID\": 2,\n         \"TITLE\": \"Beispiel Title 2 du geile Eidechse\",\n         \"ARTIST\": \"Beispiel Artist 2\",\n         \"ADDED_BY\": 1,\n         \"PATH\": \"BliBlaBlubbbPATH\"\n     },\n     {\n         \"ID\": 3,\n         \"TITLE\": \"Canon in D Major\",\n         \"ARTIST\": \"Johann Pachelbel\",\n         \"ADDED_BY\": 1,\n         \"PATH\": \"./Server/Songs/Johann Pachelbel - Canon in D Major.mp3\"\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Keine",
            "description": "<p>Songs gefunden.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\nsuccess: false,\nmsg: 'No songs available.',\nerr: err\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "SONG"
  },
  {
    "type": "get",
    "url": "/songsuser/:playlistID Gibt die selbst hinzugefügten Songs des Users aus der Playlist mit der",
    "title": "angegebenen playlistID zurück.",
    "name": "GetSongsOfUser",
    "group": "SONG",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "playlistID",
            "description": "<p>Users unique PLAYLISTS ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Songs",
            "description": "<p>in der Playlist vorhanden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n  \"success\": true,\n  \"data\": [\n     {\n         \"ID\": 1,\n         \"TITLE\": \"Canon in D Major\",\n         \"ARTIST\": \"Johann Pachelbel\",\n         \"SUPPORTED_BY\": \"max\"\n     }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Keine",
            "description": "<p>Songs vorhanden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\nsuccess: false,\nmsg: 'No songs available in this playlist.',\nerr: err\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "SONG"
  },
  {
    "type": "post",
    "url": "/song/global/:playlistID",
    "title": "Fügt einen neuen Song der Datenbank sowie der übergebenen (aktuellen) Playlist hinzu.",
    "name": "PostSongGlobal",
    "group": "SONG",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "playlistID",
            "description": "<p>Playlist unique PLAYLISTS ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Files",
            "optional": false,
            "field": "File",
            "description": "<p>Upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>SONGS TITLE.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artist",
            "description": "<p>SONGS ARTIST.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "File",
            "description": "<p>Upload erfolgreich</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"msg\": \"File uploaded successfully ;)\",\n \"path\": {\n     \"PATH\": \"./Server/Songs/Johann Pachelbel - Canon in D Major.mp3\"\n }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n        {\n \"success\": true,\n \"msg\": \"Recognized that playlist is from collaborator. Song uploaded and added successfully.\",\n \"path\": {\n     \"PATH\": \"./Server/Songs/Johann Pachelbel - Canon in D Major.mp3\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Song",
            "description": "<p>existiert bereits in der Datenbank Tabelle SONGS</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Song exists already. Search for the following song to get it ;)\\n\\n' + req.files.audioFile[0].originalname',\n err: err\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Access failed.',\n err: err\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "SONG"
  },
  {
    "type": "post",
    "url": "/song/:playlistID Fügt einen bereits in der Datenbank vorhandenen Song einer seiner eigenen Playlists",
    "title": "oder einer Collaborator Playlist hinzu.",
    "name": "PostSongIntoPlaylist",
    "group": "SONG",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "playlistID",
            "description": "<p>Users unique PLAYLISTS ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "songID",
            "description": "<p>Songs unique SONGS ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Die",
            "description": "<p>Playlist ist vom aktuellen User selbst</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n  {\n \"success\": true,\n \"msg\": \"Song added to playlist successfully.\",\n \"path\": {\n     \"PATH\": \"./Server/Songs/Johann Pachelbel - Canon in D Major.mp3\"\n }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n \"success\": true,\n \"msg\": \"Recognized that playlist is from collaborator. Song added successfully.\",\n \"path\": {\n     \"PATH\": \"./Server/Songs/Johann Pachelbel - Canon in D Major.mp3\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n \"success\": false,\n \"msg\": \"Playlist of Mate could not be found.\",\n \"err\": {\n     \"errno\": 19,\n     \"code\": \"SQLITE_CONSTRAINT\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "SONG"
  },
  {
    "type": "get",
    "url": "/song/:id",
    "title": "Gibt den Song mit der angegebenen ID als ReadStream zurück",
    "name": "GetSongStream",
    "group": "USER",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Songs unique SONGS ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "xmlhttprequest",
            "optional": false,
            "field": "Starte",
            "description": "<p>ReadStream von gefundenem SONG.PATH mit Clienten</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nSTREAM",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Song",
            "description": "<p>oder Ordner nicht gefunden</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'No such file or directory.',\n err: err\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'You are not authorized for this action or playlist ist not available.',\n err: err\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "USER"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Gibt den User SCORE des aktuellen Users zurück",
    "name": "GetUser",
    "group": "USER",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "User",
            "description": "<p>Score</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  HTTP/1.1 200 OK\n{\n\"success\": true,\n\"data\":\n   {\n   \"SCORE\": 10\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Kein",
            "description": "<p>User gefunden</p>"
          },
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Nicht",
            "description": "<p>authorisiert { success: false, msg: 'You are not authorized for this action!', err: err }</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\nsuccess: false,\nmsg: 'No user found.',\nerr: err\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "USER"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Gibt alle User zurück, welche nicht der aktuelle User und nicht seine Playlist Mates sind",
    "name": "GetUsers",
    "group": "USER",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "json",
            "optional": false,
            "field": "AUTH:",
            "description": "<p>{ &quot;Authorization&quot;: token}</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "User",
            "description": "<p>wurden gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"data\": [\n   {\n       \"NAME\": \"admin\"\n   },\n   {\n       \"NAME\": \"garry\"\n   },\n   {\n       \"NAME\": \"heinz\"\n   },\n   {\n       \"NAME\": \"max\"\n   },\n   {\n      \"NAME\": \"sigmuel\"\n   }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Keine",
            "description": "<p>User gefunden</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  success: false,\n  msg: 'No other users found. You have to invite more of your friends.',\n  err: No other users found.\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "USER"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Legt einen neuen User in der Datenbank an.",
    "name": "PostUser",
    "group": "USER",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Users unique USERS NAME.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Registrierung",
            "description": "<p>erfolgreich</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\nsuccess: true,\nmsg: 'User registered successfully.',\ndata: user\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "User",
            "description": "<p>existiert bereits</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Datenbank",
            "description": "<p>Fehler</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'User exists already.',\n err: err\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Access user failed.',\n err: err\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "USER"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Überprüft den Benutzernamen und Passwort in der Datenbank.",
    "name": "UserLogin",
    "group": "USER",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Users unique USERS NAME.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "Anmeldung",
            "description": "<p>erfolgreich</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n {\n\"success\": true,\n\"msg\": \"Login was successful.\",\n\"data\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\n.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE1NDg4NTY3NTgsImV4cCI6MTU0ODg1NjkzOH0\n.bINlI8O36Ldua6xMjWY8zuZsYhZvzYPqksCj8mJxE9M\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "Anmeldung",
            "description": "<p>verweigert</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n success: false,\n msg: 'Access declined!.',\n err: err\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "our_http_server/Server/app.js",
    "groupTitle": "USER"
  }
] });
