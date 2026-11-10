
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('leaf-canvas');
  if (!canvas) return; // Exit cleanly if canvas is not on the current page
  
//////gives access to the 2D drawing tools.
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Autumn Palette
  const PALETTES = [
    { base: '#b54316', dark: '#681804', vein: '#4d1002' }, // Deep Crimson / Amber
    { base: '#cb5f1a', dark: '#802e07', vein: '#5c1e03' }, // Burnt Orange
    { base: '#d8811d', dark: '#8d4706', vein: '#5e2b02' }, // Golden Amber
    { base: '#a7601b', dark: '#633306', vein: '#421f02' }, // Russet Oak
    { base: '#886b1c', dark: '#503c09', vein: '#352504' }  // Olive Ochre
  ];

  class Leaf {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -60 - Math.random() * 50;
      this.size = 16 + Math.random() * 22; // 16px - 38px
      this.speedY = 1.0 + Math.random() * 1.6;
      this.speedX = -0.5 + Math.random() * 1.0;
      this.swaySpeed = 0.015 + Math.random() * 0.025;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swayDistance = 25 + Math.random() * 35;

      // 3D rotation angles & tumbling speeds
      this.rotZ = Math.random() * Math.PI * 2;
      this.rotZSpeed = (Math.random() - 0.5) * 0.035;
      this.rotX = Math.random() * Math.PI;
      this.rotXSpeed = 0.02 + Math.random() * 0.03;

      this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      this.type = Math.floor(Math.random() * 3); // 0: Maple, 1: Oak, 2: Oval
      this.depth = 0.6 + Math.random() * 0.4;
    }

    update() {
      this.y += this.speedY * this.depth;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * (this.swayDistance * 0.03) + this.speedX;

      this.rotZ += this.rotZSpeed;
      this.rotX += this.rotXSpeed;

      if (this.y > height + 80) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();

      const renderX = this.x + Math.sin(this.swayAngle) * this.swayDistance;
      ctx.translate(renderX, this.y);

      ctx.rotate(this.rotZ);
      const flipScale = Math.sin(this.rotX);
      ctx.scale(this.depth, this.depth * flipScale);

      ctx.shadowColor = 'rgba(40, 20, 10, 0.22)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 3 * Math.sign(flipScale);

      const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
      grad.addColorStop(0, this.palette.dark);
      grad.addColorStop(0.5, this.palette.base);
      grad.addColorStop(1, this.palette.dark);

      ctx.fillStyle = grad;
      ctx.strokeStyle = this.palette.vein;
      ctx.lineWidth = 0.9;

      ctx.beginPath();
      const s = this.size;

      if (this.type === 0) {
        // Maple / Sycamore
        ctx.moveTo(0, s);
        ctx.bezierCurveTo(s * 0.3, s * 0.6, s * 0.8, s * 0.7, s * 0.6, s * 0.2);
        ctx.bezierCurveTo(s * 0.9, s * 0.2, s * 0.9, -s * 0.2, s * 0.5, -s * 0.3);
        ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.4, -s * 0.8, 0, -s);
        ctx.bezierCurveTo(-s * 0.4, -s * 0.8, -s * 0.7, -s * 0.6, -s * 0.5, -s * 0.3);
        ctx.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.9, s * 0.2, -s * 0.6, s * 0.2);
        ctx.bezierCurveTo(-s * 0.8, s * 0.7, -s * 0.3, s * 0.6, 0, s);
      } else if (this.type === 1) {
        // Oak
        ctx.moveTo(0, s);
        ctx.bezierCurveTo(s * 0.4, s * 0.7, s * 0.6, s * 0.4, s * 0.3, s * 0.2);
        ctx.bezierCurveTo(s * 0.7, 0, s * 0.6, -s * 0.4, s * 0.2, -s * 0.5);
        ctx.bezierCurveTo(s * 0.4, -s * 0.8, 0, -s * 0.9, 0, -s);
        ctx.bezierCurveTo(0, -s * 0.9, -s * 0.4, -s * 0.8, -s * 0.2, -s * 0.5);
        ctx.bezierCurveTo(-s * 0.6, -s * 0.4, -s * 0.7, 0, -s * 0.3, s * 0.2);
        ctx.bezierCurveTo(-s * 0.6, s * 0.4, -s * 0.4, s * 0.7, 0, s);
      } else {
        // Teardrop / Birch
        ctx.moveTo(0, s);
        ctx.bezierCurveTo(s * 0.6, s * 0.4, s * 0.6, -s * 0.4, 0, -s);
        ctx.bezierCurveTo(-s * 0.6, -s * 0.4, -s * 0.6, s * 0.4, 0, s);
      }

      ctx.closePath();
      ctx.fill();

      // Stem & Center Vein
      ctx.beginPath();
      ctx.moveTo(0, s * 1.15);
      ctx.lineTo(0, -s * 0.85);
      ctx.stroke();

      ctx.restore();
    }
  }

  const LEAF_COUNT = 45;
  const leaves = Array.from({ length: LEAF_COUNT }, () => new Leaf(true));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const leaf of leaves) {
      leaf.update();
      leaf.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
});