export default class PingController {
  static ping = (req, res) => {
    res.status(200).json({ message: 'i\'m alive' });
  };
}
