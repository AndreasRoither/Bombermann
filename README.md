
# Bombermann

### Description:

Bombermann is a game built with Javascript HTML and CSS. It's a remake from the classic game [Bomberman](https://de.wikipedia.org/wiki/Bomberman).

### Installation
Download the repository. Install [Node JS](https://nodejs.org/en/). Start the Node JS Server with: node index.js in the console from the node js folder in the repo. After that open up the index.html file in your browser. Enjoy.
As an alternative you can also start the server with the .bat files.

### INFO
Bombermann is undergoing constant change, so things might be buggy!
Working Example: [Bombermann](http://193.170.132.113:3000/)

### How-To
When you opened the page a modal popup will show. Input your name and choose the difficulty and the gamemode. Click create to start your game session. If you click the copy id button the game id will be copied to your clipboard. If you want others to join just send them the copied id. Every player has to press the ready toogle button to start the game. If all died or a winner has been decided, restarting the game will be possible when every player is ready again.

### Example Images
<p align="center">
  <img src="https://github.com/AndiRoither/Bombermann/blob/master/img/1.PNG" width="800"/>
</p>

<p align="center">
  <img src="https://github.com/AndiRoither/Bombermann/blob/master/img/2.PNG" width="800"/>
</p>

<p align="center">
  <img src="https://github.com/AndiRoither/Bombermann/blob/master/img/3.PNG" width="800"/>
</p>

<p align="center">
  <img src="https://github.com/AndiRoither/Bombermann/blob/master/img/4.PNG" width="800"/>
</p>

### Docker
- Locate the `js` folder and open `io.js` inside
- Change `localhost:4200` to your specific needs
- Create image:  
  - `docker image build -t bombermann:bombermann .`
- Start container with compose:  
  - `docker-compose up`

### Technology used
Built with:  
[Visual Studio Code](https://code.visualstudio.com/)  
[Node JS](https://nodejs.org/en/)

### Credits
Images used from [gamedevelopment.tutsplus.com](https://gamedevelopment.tutsplus.com/articles/enjoy-these-totally-free-bomberman-inspired-sprites--gamedev-8541).
The images belong to [Jacob Zinman-Jeanes](http://jeanes.co/).
