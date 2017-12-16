export default class StarField {

  constructor() {
    this.center = {x:0, y:0};
    this.bounds = {x:0, y:0};
    this.particles = [];
    this.particleCount = 200;
    this.color = "white";
    this.clearing = true;
    this.spawnRadius = 10;
  }

  draw (context) {

    if (this.clearing) {
      context.fillStyle = "rgba(0, 0, 10, 0.1)";
      context.fillRect(0, 0, 2 * this.center.x, 2 * this.center.y);
    }

    context.fillStyle = this.color;

    this.particles.forEach((particle) => {
      context.fillRect(
        particle.x - 1,
        particle.y - 1,
        2, 2);
    });
  }

  update (context) {

    const bounds = {
      x: context.canvas.width,
      y: context.canvas.height
    };

    const center = {
      x: bounds.x / 2,
      y: bounds.y / 2
    };

    while (this.particles.length < this.particleCount){
      this.particles.push({
        x: 2 * this.spawnRadius * Math.random() - this.spawnRadius + center.x,
        y: 2 * this.spawnRadius * Math.random() - this.spawnRadius + center.y
      });
    }

    this.particles.forEach((particle, i) => {
      particle.x += (particle.x - center.x) * 0.02;
      particle.y += (particle.y - center.y) * 0.02;

      if (particle.x < 0 ||
          particle.x > bounds.x ||
          particle.y < 0 ||
          particle.y > bounds.y
      )
      {
        this.particles.splice(i, 1);
      }
    });
  }
}
