#project FebMusicPlaylist

##Team
Das Team besteht aus Julian Fess (Matr. 672836) und Franz-Johannes Weber 
(Matr. 672622).


## Idee
Grundsätzlich ist die Idee, eine kleine Web Plattform zum Erstellen und Abspielen von Playlists 
zu entwickeln. Die User der Plattform haben die Möglichkeit Ihre eigenen Playlists zu erstellen.
In die Playlists können User Songs hinzufügen, die in der Server-Datenbank verfügbar sind.
User können andere User zu Ihren Freunden hinzufügen indem sie Ihnen eine Freundesanfrage senden.
Die Playlists sind entweder privat, für Freunde offen oder für alle User öffentlich. Private Playlists können nur vom
User der sie erstellt hat angesehen und angehört werden. Playlists die für Freunde öffentlich gemacht wurden, können von 
Freunden angesehen und angehört werden. Öffentliche Playlists sind für alle User offen zugänglich. Zusätzlich dazu 
können die Playlists mit den Freunden geteilt werden, was diese Freunde zu Playlist 
Mates macht und Ihnen die Mitarbeit an der Playlist ermöglicht. Nun können die Playlist Mates beliebig Songs der Playlist 
hinzufügen oder löschen, sowie die Reihenfolge der Songs innerhalb der Playlist verändern.


## Grundsätzliche Aufgaben (Anforderungen)

- User haben Benutzerkonten, Login mit Username und Passwort
- Registrierung für neue User
- User können Playlists erstellen
- User können Songs einer Playlist hinzufügen
- Eigene Songs der User können der Plattform hinzugefügt werden.
- User können andere User zu ihren Freunden hinzufügen
- User können Freunde zu Playlist Mates machen und Ihnen dadurch Mitarbeit an ihrer Playlist ermöglichen  


##Aufgaben des Servers

- Auf dem Server muss eine Datenbank vorhanden sein, die:
    - (lizensfreie) Musik in einer Tabelle Songs beinhaltet 
    - die Playlists der einzelnen User beinhaltet
    - die User Daten der User beinhaltet 
        - Tabelle Songs 
            - Attribute:  SongID (primary), Titel, Artist, Album, Uploader (derjenige der den Titel auf die Plattform hochgeladen hat)
        - Tabelle Playlists
            - Attribute: PlaylistID (primary), Name 
        - Tabelle User
            - Attribute: username (primary), password
        - Tabelle PlaylistContains
            - Attribute: PlaylistID (foreign), SongID (foreign)
        - Tabelle PlaylistFrom
            - Attribute: PlaylistID (foreign), username (foreign)
        - Tabelle Friends (User sind mit anderen Usern befreundet)
            - Attribute: username (foreign), username_friend (foreign) 
- Die Datenbank ist erweiterbar, damit neue Songs von den Usern hinzugefügt werden
können)
- Der Server liefert dem Client abspielbare Musik in Form eines Streams
- Die User Daten (Benutzername, Passwort) werden vom Server beim Login überprüft


## Aufgaben des Clients

- Unten in den Wireframes wird das vorläufige Design des Clients gezeigt
- Der Client muss den Usern ermöglichen ein Benutzerkonto zu erstellen und zu verwalten
    - Dazu gehört Registrierungs-Screen, Login-Screen und Benutzerkontenverwaltung für bereits 
    existierende User
        - Benutzerkontenverwaltung: Hier kann der User seinen Account verwalten. Dazu gehört:
            - Benutzerkonto löschen
            - Passwort ändern
            - Anzeige der eigenen favorisierten Artists 
            - Anzeige wie viele Songs der User hochgeladen hat
            - Anzeige wie viele Playlists der User schon erstellt hat
            - ein Score wird angezeigt 
            - die Playlist Mates werden absteigend sortiert nach der Anzahl an geteilten Playlists 
            angezeigt
- Desweiteren ermöglicht der Client das Verwalten der von den Usern erstellten Playlists und den darin
enthaltenen Songs
- Im Client ist ein Musik Player enthalten, welcher die Songs aus den Playlists abspielen
kann
- Die User können mit Hilfe einer User Suche neue User finden um sie als Freunde hinzuzufügen.
- 

## Aufwandsschätzung

###Client (Julian Fess)

| Teilaufgabe   | Zeit in Stunden |
|----------|:-------------:|
| Projektplanung (Wireframes, README)  | 10 |
| Benutzerkonto Screen, Login Screen und Registrierungs Screen bauen | 15 |
| Musikplayer integrieren| 10 |
| Freunde anzeigen lassen und den Screen für die Anzeige | 10 |
| Projektdokumentation | 10 |

###Server (Franz-Johannes Weber)

| Teilaufgabe   | Zeit in Stunden |
|----------|:-------------:|
| Projektplanung (Wireframes, README)  | 10 |
| Datenbank aufbauen | 10 |
| | |
| Projektdokumentation | 10 |

## Wireframes

### Page Main
![Bild MainPage](./Wireframes/Page0_MainPage.png "MainPage")
Sobald die Root-Page aufgerufen wird, 

### Page PlaylistSongs
![Bild PlaylistSongs](./Wireframes/Page1_PlaylistSongs.png "PlaylistSongs") 
### Page GoToUsers
![Bild GoToUsers](./Wireframes/Page2_GoToUsers.png "GoToUsers") 
### Page SearchForUsers
![Bild SearchForUsers](./Wireframes/Page3_SearchForUsers.png "SearchForUsers") 
### Page MyFriends
![Bild MyFriends](./Wireframes/Page4_MyFriends.png "MyFriends") 
### Page MyAccount
![Bild MyAccount](./Wireframes/Page5_MyAccount.png "MyAccount") 
