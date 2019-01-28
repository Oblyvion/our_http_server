## Abstract Server
Verantwortlicher: Franz-Johannes Weber

1. Allgemein
...
2. Server
Auf dem Server werden alle vorhandenen User, Playlists und Songs in einer SQLITE-Datenbank gespeichert, 
verwaltet und auch wieder an den Client, den Anforderungen entsprechend zurückgeliefert.
Beim ersten Start des Servers, wird zunächst die Datenbank aufgebaut und anschließend ein User mit Benutzername "admin"
und Passwort "admin" erstellt. Zusätzlich erhält der User admin eine Playlist, worin er Songs hochladen und einspeichern
kann. Außerdem wird nach jeder erfolgreichen Registrierung eines Users, eine Standard-Playlist mit einem lizenzfreien 
Standard-Song erzeugt und 5 Score-Punkte auf seinen User-Account gutgeschrieben.

Der Server selbst ist in Javascript mit den Frameworks node.js und express.js implementiert und ist über
den Port 3000 erreichbar. Desweiteren wurden alle benötigten Routen in einer API zusammengefasst und dem
Client zur Verfügung gestellt, um mit dem Server eine einwandfreie Kommunikation zu gewährleisten. Damit die Kommunikation
auch für jeden User eindeutig ist, wurde eine Authentifizierung mittels JWT-Token realisiert.
Das Datenbankmodell sowie die API werden im Folgenden näher beschrieben.

Datenbankmodell implementiert worden:
   - Auf dem Server muss eine Datenbank vorhanden sein, die:
      - (lizensfreie) Musik in einer Tabelle Songs beinhaltet
      - die Playlists der einzelnen User beinhaltet
      - die User Daten der User beinhaltet
   - Die Datenbank ist erweiterbar, damit neue Songs von den Usern hinzugefügt werden können)
   - Der Server liefert dem Client abspielbare Musik in Form eines Streams
   - Die User Daten (Benutzername, Passwort) werden vom Server beim Login überprüft

## Entwicklungsplan
### Entwurf
#### Datenbankmodell
NEUES KOMMT SOFORT!
![Bild DatenbankModell](./Database/DatenbankModell.png "DatenbankModell")

#### ORM 
WAS GENAU NOCHMA?
![Bild ORM](./Database/ORM.png "ORM")

#### Definition der API
Bei Aufruf von http://www.127.0.0.1:3000

```
 GET /init
```
Datenbank wird initialisiert.

**Responses:** 

_Akzeptiert_

{success: true, msg: 'db ready to use'}

_Abgelehnt_

{success: false, msg: 'db ready to use'}

```
 GET /users
```
Gibt alle User zurück, welche nicht der aktuelle User und nicht seine Playlist Mates sind.

**Responses:** 

_Akzeptiert_

{success: true, data: rows}

_Abgelehnt_

{success: false, msg: 'No other users found.', err: err}

**Headers:**

 Authorization: token

```
 GET /user
```
Gibt den User SCORE des aktuellen Users zurück.

**Responses:** 

_Akzeptiert_

{success: true, data: row}

_Abgelehnt_

{success: false, msg: 'No user found.', err: err}

{success: false, msg: 'You are not authorized for this action!', err: err}

**Headers:**

 Authorization: token
 
 **Params:**
 
 :id = USERS.ID

```
 GET /songs
```
Gibt alle Songs zurück.

**Responses:** 

_Akzeptiert_

{success: true, data: rows}

_Abgelehnt_

{success: false, msg: 'No songs available.', err: err}

```
 GET /songsuser/:playlistID
```
Gibt die selbst hinzugefügten Songs des Users aus der Playlist mit der angegebenen playlistID zurück.

**Responses:** 

_Akzeptiert_

{success: true, data: row}

_Abgelehnt_

{success: false, msg: 'No songs available in this playlist.', err: err}

**Headers:**

 Authorization: token
 
 **Params:**
 
 :playlistID = PLAYLISTS.ID
 
 ```
  GET /song/:id
 ```
 Gibt den Song mit der angegebenen ID als ReadStream zurück.
 
 **Responses:** 
 
 _Akzeptiert_
 
 Starte ReadStream von gefundenem SONG.PATH mit Clienten.
 
 _Abgelehnt_
 
 // TODO EVENTUELL RAUSNEHMEN BEIDE FALSE ANFRAGEN
 
 {success: false, msg: 'No such file or directory.', err: err} 
 
 {success: false, msg: 'You are not authorized for this action or playlist ist not available.', err: err}

 **Headers:**
 
  Authorization: token
  
  **Params:**
  
  :id = SONGS.ID

 ```
  GET /playlists
 ```
 Gibt die Playlists vom aktuellen User zurück.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, data: rows} 
 
 _Abgelehnt_
 
 {success: false, msg: 'Found no playlists.', err: err} 
 
 **Headers:**
 
  Authorization: token
  
 ```
  GET /playlists/collabs
 ```
 Gibt die Playlists von den Collaborators des aktuellen Users zurück.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, data: rows} 
 
 _Abgelehnt_
 
 {success: false, msg: 'Found no collaborator playlists.', err: err} 
 
 **Headers:**
 
  Authorization: token

```
  GET /playlistMates
 ```
 Gibt die Playlist Mates vom aktuellen User zurück.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, data: rows} 
 
 _Abgelehnt_
 
 {success: false, msg: 'Nothing in there, yet.', err: err}  
 
 {success: false, msg: 'You are not authorized for this action.', err: err} 

 {success: false, msg: 'UNCATCHED error', err: err} 

 **Headers:**
 
  Authorization: token

 ```
  GET /playlistMates/sharedPlaylists/:mate
 ```
 Gibt die Anzahl an geteilten Playlists mit dem Mate zurück.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, data: rows[0]}
 
 _Abgelehnt_
 
 {success: false, msg: 'The counter feels tired right now.', err: err} 
 
 {success: false, msg: 'You are not authorized for this action or no mates are available.', err: err}

 **Headers:**
 
  Authorization: token
  
  **Params:**
  
  :mate = USERS.NAME

```
  POST /user
 ```
 Legt einen neuen User in der Datenbank an.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, msg: 'User registered successfully.', data: user}
 
 _Abgelehnt_
 
 {success: false, msg: 'User exists already.', err: err} 
 
 {success: false, msg: 'Access user failed.', err: err}

  **Params:**
  
  req.body.name = USERS.NAME
  
```
  POST /login
 ```
 Überprüft den Benutzernamen und Passwort in der Datenbank.
 
 **Responses:** 
 
 _Akzeptiert_
 
 {success: true, msg: 'Login was successful.', data: token}
 
 _Abgelehnt_
 
 {success: false, msg: 'Access declined!.', err: err} 
 
  **Params:**
  
  req.body.name = USERS.NAME
  
  ```
    POST /playlist
  ```
   Überprüft den Benutzernamen und Passwort in der Datenbank.
   
   **Responses:** 
   
   _Akzeptiert_
   
   {success: true, msg: 'Playlist created successfully.', data: playlist}
   
   _Abgelehnt_
   
   {success: false, msg: 'Cannot insert playlists at this time.', err: err} 
   
   {success: false, msg: 'You are not authorized for this action.', err: err}
   
   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   req.body.name = PLAYLISTS.NAME
 
  ```
  
    POST /song/:playlistID
  ```
   Fügt einen bereits in der Datenbank vorhandenen Song einer seiner eigenen Playlists
   oder einer Collaborator Playlist hinzu.
   
   **Responses:** 
   
   _Akzeptiert_ (Playlist muss von User selbst sein!)
   
   {success: true, msg: 'Song added to playlist successfully.', path: filePath}
   
   _Abgelehnt_
   
   (Playlist muss von Collaborator selbst sein!)
   {success: true, msg: 'Recognized that playlist is from collaborator. Song added successfully.', path: filePath} 
   
   (Sonst error)   
   {success: false, msg: 'Playlist of Mate could not be found.', err: err}
   
   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   :playlistID = PLAYLIST.ID  
   req.body.songID = SONGS.ID
     
  ```
    POST /song/global/:playlistID
  ```
   Fügt einen neuen Song der Datenbank sowie der übergebenen (aktuellen) Playlist hinzu.
   
   **Responses:** 
   
   _Akzeptiert_ (Playlist muss von User selbst sein!)
   
   {success: true, msg: 'File uploaded successfully ;)', path: filePath}
   
   _Abgelehnt_
   
   (Playlist muss von Collaborator selbst sein!)
   {success: true, msg: 'Recognized that playlist is from collaborator. Song uploaded and added successfully.', path: filePath} 
   
   (Sonst error)   
   {success: false, msg: 'Playlist of Mate could not be found.', err: err}
   
   {success: false, msg: 'Song exists already. Search for the following song to get it ;)\n\n' + 
   req.files.audioFile[0].originalname', err: err}

   {success: false, msg: 'Access failed.', err: err}

   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   :playlistID = PLAYLIST.ID   
   req.files = {lot of file data}   
   req.body.title = SONGS.TITLE  
   req.body.artist = SONGS.ARTIST

  ```
    POST /playlistMate
  ```
   Fügt einen neuen Playlist Mate seinem User-Account hinzu.
   
   **Responses:** 
   
   _Akzeptiert_
   
   {success: true, msg: 'Playlist Mate request send to ' + req.body.mate + ' successfully.'}
   
   _Abgelehnt_
   
   {success: false, msg: 'The user -> ' + req.body.mate + ' <- is your Playlist Mate already. Hire another User.'}
   
   {success: false, msg: 'You are not authorized to add new Playlist Mate.', err: err}

   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   req.body.mate = USERS.NAME
   
```
    POST /collabs/:playlistID
  ```
   Fügt einen neuen Collaborator zu der Playlist mit der angegebenen ID hinzu.
   
   **Responses:** 
   
   _Akzeptiert_
   
   {success: true, msg: 'Collaborator ' + req.body.mate + ' has been added to your account successfully.'}
   
   _Abgelehnt_
   
   {success: false, msg: 'The Playlist Mate -> ' + req.body.mate + ' <- is one of your Collaborators already.
   Invite another Playlist Mate.'}
   
   {success: false, msg: 'There is a problem with you or your collaborator.', err: err}

   {success: false, msg: 'Your mate called -> ' + req.body.mate + ' <- has not accept your Playlist Mate request.', err: err}

   {success: false, msg: 'You are not authorized for this action.', err: err}

   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   :playlistID = PLAYLISTS.ID
   
   req.body.mate = USERS.NAME
      
```
    POST /playlistMates/request
  ```
   Akzeptiert oder verweigert einen Playlist Mate Request.
   
   **Responses:** 
   
   _Akzeptiert_
   
   {success: true, msg: 'Decline Playlist Mate Request: Playlist Mates deleted!'}
   
   {success: true, msg: 'User ' + req.body.mate + ' and you are Playlist Mates now.'}

   _Abgelehnt_
   
   {success: false, msg: 'Delete from Playlist Mates failed.', err: err}
   
   {success: false, msg: 'Cannot find such Playlist Mate. Add user as Playlist Mate first!', err: err}

   {success: false, msg: 'You are not authorized for this action.', err: err}

   **Headers:**
    
   Authorization: token
     
   **Params:**
    
   :playlistID = PLAYLISTS.ID
   
   req.body.mate = USERS.NAME
      
### Template Object

Folgendermaßen sieht ein Template Object unserer Datenbank aus:

Beispiel anhang von GET/ http://127.0.0.1:3000/playlistMates
```json5
{
    "success": true,
    "data": [
        {
            "NAME": "test",
            "SCORE": 10,
            "REQUEST": 1
        }
    ]
}
```

Beispiel anhang von GET/ http://127.0.0.1:3000/playlistMates/sharedPlaylists/test
```json5
{
    "success": true,
    "data": {
        "countSharedPlaylists": 0
    }
}
```

## Aufwandsschaetzung

### Backend
Verantwortlicher: Franz-Johannes Weber

#### Projektvorbereitung

| Aufgabe | Zeit in Stunden 
|----------|:-------------:
| Wireframes Desktop  | 5 
| Wireframes Mobil | 5
| Desktop Wireframes beschreiben | 5 
| Datenbank Modell entwerfen | 3
| Server Abstract | 1
| ORM entwerfen | 4
| API Beschreibung | 5
| Projektvorschlag strukturieren | 2
| SUMME | 30 

#### Implementierung

| Aufgabe | Zeit in Stunden |
|----------|:-------------:|
| Datenbank aufbauen und verwalten | 10 
| API aufbauen | 30
| Filestreaming konfigurieren | 20 
| User-Suche und Rankingsystem implementieren | 10 
| Zufälliger User Screen erstellen | 2
| About us, Contact und Impressum anfertigen und designen | 10 
| Playlist Teilen-Funktionen (als Email-Text oder mit User) einbinden | 5 
| SUMME | 50 

#### Dokumentation und Tests

| Aufgabe | Zeit in Stunden 
|----------|:-------------:
| Projektdokumentation | 15
| API Tests | 5 
| SUMME | 20 

#### Zusammenfassung

| Teil | Zeit in Stunden 
|----------|:-------------:
| Projektvorbereitung | 30 
| Implementierung | 50 
| Dokumentation und Tests | 20 
| SUMME  | 100 
