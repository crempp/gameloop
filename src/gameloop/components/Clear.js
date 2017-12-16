export default class Clear {

  constructor(color) {
    this.color = color || null;
  }

  draw (context) {
    const width = context.canvas.width;
    const height = context.canvas.height;

    context.setTransform(1, 0, 0, 1, 0, 0);

    if (this.color === null){
      context.clearRect(0, 0, width, height);
    } else {
      context.save();
      context.fillStyle = this.color;
      context.fillRect(0, 0, width, height);
      context.restore();
    }
  }
}
