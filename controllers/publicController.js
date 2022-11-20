export default class PublicController {
  static index = (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  };
  
  static game = (req, res) => {
    res.sendFile(process.cwd() + '/views/game.html');
  }
}
