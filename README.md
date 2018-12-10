#project FebMusicPlaylist


![Bild bla](./Wireframes/bla.png "hallo") 
##Team
Das Team besteht aus Julian Fess (Matr. 672836) und Franz-Johannes Weber 
(Matr. 672622)


## Idee
Grundsätzlich ist die Idee, eine kleine Web Plattform zum Erstellen und Abspielen von Playlists 
zu entwickeln. Die User der Plattform haben die Möglichkeit Ihre eigenen Playlists zu erstellen.
In die Playlists können User Songs hinzufügen, die in der Server-Datenbank verfügbar sind.
Die Playlists können mit anderen Usern geteilt werden. Die User mit denen die Playlists geteilt 
wurden, sind in der Lage diese Playlists anzusehen und anzuhören. Zusätzlich dazu können die 
Playlists auch für andere User freigegeben werden, was diesen Usern die Mitarbeit an der Playlist
ermöglicht. Nun können die freigegebenen User Songs der Playlist hinzufügen und löschen sowie die 
Reihenfolge verändern.


## Grundsätzliche Aufgaben (Anforderungen)

- User haben Benutzerkonten, Login mit Username und Passwort
- Registrierung für neue User
- User können Playlists erstellen
- User können Playlists Songs hinzufügen
- Eigene Songs der User können der Plattform hinzugefügt werden
- User können andere User zu ihren Freunden hinzufügen



##Aufgaben des Servers

- Auf dem Server muss eine Datenbank vorhanden sein, die (lizensfreie) Musik beinhaltet 
    - Der Server liefert dem Client abspielbare Musik in Form eines Streams
    - Die Datenbank ist erweiterbar, damit neue Songs von den Usern hinzugefügt werden
    können)
    - Tabelle Songs 
    - Attribute: Titel, Artist, Album, Uploader (derjenige der den Titel auf die Plattform hochgeladen hat)
- Der Server bietet die Möglichkeit die vom User erstellten Playlists zu speichern
- Die Daten der Benutzer (Benutzername, Passwort) müssen ebenfalls vom Server gespeichert werden um Sie beim Login abzufragen


## Aufgaben des Clients

- Unten in den Wireframes wird das vorläufige Design des Clients gezeigt
- Der Client muss den Usern ermöglichen ein Benutzerkonto zu erstellen und zu verwalten
    - Dazu gehört Registrierungs-Screen, Login-Screen und Benutzerkontenverwaltung für bereits 
    existierende User
- Desweiteren ermöglicht der Client das Verwalten der von den Usern erstellten Playlists und den darin
enthaltenen Songs
- 
