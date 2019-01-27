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
HIER FÄNGT DIE ERSTE ROUTE AN...

#### Page Login
Bei Aufruf von https://www.127.0.0.1:3000/login:
##### Client kann sich anmelden, falls user in der Datenbank vorhanden.
```
 GET /login/user
```
In dieser Route nimmt der Server einen user entgegen.
Als Antwort liefert er den user.

#### Page Registration
Bei Aufruf von https://www.127.0.0.1:3000/registration:
##### Dem Client muss ermöglicht werden, einen neuen user der Datenbank hinzuzufügen.
```
 POST /registration/user
```
In dieser Route nimmt der Server einen user entgegen.
Als Anweisung legt er den neuen user an.

#### Page Main
Bei Aufruf von https://www.127.0.0.1:3000/user/pageMain:
##### Der Client kann eine neue playlist erstellen.
````
 POST /user/pageMain/playlist
````
In dieser Route nimmt der Server eine playlist entgegen.
Als Anweisung legt er die neue playlist an.
##### Der Client bekommt alle songs aus der jeweiligen playlist.
```
 GET /user/pageMain/playlist/id
```
In dieser Route nimmt der Server eine playlist id entgegen.
Als Antwort liefert er die playlist mit der entsprechenden id.
##### Der Client kann den song ändern.
````
 PUT /user/pageMain/song
````
In dieser Route nimmt der Server einen song entgegen.
Als Anweisung verändert er den song.
##### Der Client kann einen song anfordern.
````
 GET /user/pageMain/song/id
````
In dieser Route nimmt der Server eine song id entgegen.
Als Antwort liefert er den song mit der entsprechenden id.
##### Client kann song löschen.
````
 DELETE /user/pageMain/song/id
````
In dieser Route nimmt der Server eine song id entgegen.
Als Anweisung löscht er den song mit der entsprechenden id.

##### Client bekommt nach Interaktion mit Eingabefeld, passende songs je nach eingegebener Zeichenkette angezeigt.
````
 GET /user/pageMain/add/song
````
In dieser Route nimmt der Server einen song entgegen.
Als Antwort liefert er eine Liste passender songs.
##### Client kann einen song seiner playlist hinzufügen
````
 POST /user/pageMain/add/song
````
In dieser Route nimmt der Server einen song entgegen.
Als Anweisung legt er den neuen song an.

#### Page My Playlist Mates
Bei Aufruf von https://www.127.0.0.1:3000/user/myPlaylistMates:
##### Der Client kann alle seine playlist mates einsehen.
````
 GET /user/myPlaylistMates/playlistMates
````
Der Server liefert als Antwort alle playlist mates des users.
##### Der Client kann einen playlist mate löschen.
````
 DELETE /user/myPlaylistMates/playlistMate
````
In dieser Route nimmt der Server einen playlist mate entgegen.
Als Anweisung löscht er diesen playlist mate aus seiner playlist mate Liste.

#### Page Search for new playlist mate
Bei Aufruf von https://www.127.0.0.1:3000/user/newPlaylistMate:
##### Der Client kann einen neuen playlist mate hinzufügen.
````
 POST /user/newPlaylistMate/playlistMate
````
In dieser Route nimmt der Server einen playlist mate entgegen.
Als Anweisung legt er einen neuen playlist mate an.
##### Der Client bekommt alle user.
````
 GET /user/newPlaylistMate/users
````
Der Server liefert als Antwort alle user.

#### Page My Account
Bei Aufruf von https://www.127.0.0.1:3000/user/myAccount:
##### User Account Informationen werden abgerufen.
````
 GET /user/myAccount
````
In dieser Route liefert der Server alle Daten des aktuell angemeldeten users.
##### User Account kann gelöscht werden.
````
 DELETE /user/myAccount/deleteAccount
````
In dieser Route löscht der Server den aktuell angemeldeten user.
##### User Account Passwort kann verändert werden.
````
 POST /user/myAccount/changePassword/newPassword
````
In dieser Route nimmt der Server eine Zeichenkette entgegen.
Als Anweisung ändert er das Passwort des aktuell angemeldeten users.

#### Page My Playlist Mate Request
Bei Aufruf von https://www.127.0.0.1:3000/user/myPlaylistMateRequests:
##### Playlist Mate Requests können abgefragt werden.
````
 GET /user/myPlaylistMateRequests/
````
In dieser Route liefert der Server alle offenen playlist mate Anfragen des aktuell angemeldeten users.
##### Playlist Mates können dem User Acoount hinzugefügt werden.
````
 POST /user/myPlaylistMateRequests/user
````
In dieser Route nimmt der Server einen user entgegen.
Als Anweisung fügt er diesen user den playlist mates vom aktuell angemeldeten user hinzu.
##### Playlist Mate Requests können gelöscht/abgelehnt werden.
````
 DELETE /user/myPlaylistMateRequests/user
````
In dieser Route nimmt der Server einen user entgegen.
Als Anweisung löscht er den playlist mate request.

#### Page About us
Bei Aufruf von https://www.127.0.0.1:3000/aboutUs:
##### About us Informationen können angefordert werden.
````
 GET /aboutUs/
````
In dieser Route liefert der Server die allgemeinen Informationen über die Entwickler.

#### Page Contact
Bei Aufruf von https://www.127.0.0.1:3000/contact:
##### User kann Text an Entwicklern senden.
````
 POST /user/contact/sendIt
````
In dieser Route nimmt der Server eine Zeichenkette entgegen.
Als Anweisung sendet er diese Zeichenkette an die hinterlegte E-Mail Adresse.

#### Page Impressum
Bei Aufruf von https://www.127.0.0.1:3000/impressum:
##### Impressum Informationen können angefordert werden.
````
 GET /impressum/
````
In dieser Route liefert der Server die genauen Informationen über die Entwickler.

### Template Object

Folgendermaßen sieht ein Template Object unserer Datenbank aus:

```json5
{
  success: true,
  username: "fliesentischklaus25",
  passwordHashSha2: "ba9b353684f9ae6badc6e11a2f534d3a0a6cd4d625174b2e6b216ba32498c524",
  playlistsAdded: 5,
  songsAdded: 30,
  score: 100,
  playlistMates: ["user21", "user55"],
  playlistIDs: [1, 53]
}
```

```json5
{
  success: false,
  msg: "ERROR: Username does not exist"
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
