import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js";

const svg = SVG(".canvas");
const g = svg.group();
const u = gsap.utils;
const { width, height } = svg.viewbox();
const numStripes = 20;
const spacing = width / numStripes;

function generate() {
  g.clear();
  let grid = g.group();
  grid.attr("opacity", 0.2);

  for (let i = 0; i < width; i += spacing) {
    grid
      .line(i, 0, i, height)
      .stroke({ color: "#1f272f", width: 0.5, linecap: "round" });
    grid
      .line(height, i, 0, i)
      .stroke({ color: "#1f272f", width: 0.5, linecap: "round" });
  }

  let firstCircle = {
    x: u.random(0, width - 100),
    y: u.random(0, height - 100),
    r: u.random(120, 180, 5)
  };
  g.circle(firstCircle.r)
    .move(firstCircle.x, firstCircle.y)
    .attr("mask", "url(#maskedHeavyNoise)")
    .attr("fill", "url(#black)")
    .attr("class", "semi");

  let squares = g.group();
  squares.attr("class", "squares");
  let maxSquares = 26;

  for (let i = 0; i < maxSquares; i++) {
    squares
      .rect(spacing, spacing)
      .fill("#1f272f")
      .move(u.random(0, width, spacing), u.random(0, width, spacing));
  }

  let mess = g
    .rect(width, width)
    .fill("#000")
    .attr("filter", "url(#noise2)")
    .opacity(0.1);

  let lines = g.group();
  lines.attr("mask", "url(#maskedNoise)").attr("class", "pattern");
  let picker = u.random(0, 6, 1);
  for (let i = 0; i < width; i += spacing) {
    let line;
    switch (picker) {
      case 0:
        line = lines.line(i, i, 0, height);
        break;
      case 1:
        line = lines.line(0, 0, i, height);
        break;
      case 2:
        line = lines.line(i, i, i, height);
        break;
      case 3:
        line = lines.line(0, height, i, i);
        break;
      case 4:
        line = lines.line(i, 0, height, i);
        break;
      case 5:
        line = lines.line(i, height, 0, i);
        break;
      case 6:
        line = lines.line(i, height, height, i);
        break;
    }
    line.stroke({ color: "#1f272f", width: 0.5, linecap: "round" });
  }

  let noOfRects = u.random(1, 5);
  let rectX = u.random(0, width - 50);
  let rectY = u.random(0, width - 50);
  let rectW = u.random(20, width / 2.3);
  let rectH = u.random(20, width / 2.3);
  let screens = g.group().attr("class", "screens");

  for (let i = 0; i < noOfRects; i += 1) {
    var rect = screens
      .rect(rectH, rectW)
      .move(rectX, rectY)
      .stroke("#1f272f")
      .fill("#eee2d5");

    rectX += 5;
    rectY -= 5;
  }

  let circles = [];

  function doesCircleHaveACollision(circle) {
    for (var i = 0; i < circles.length; i++) {
      var otherCircle = circles[i];
      var a = circle.r + otherCircle.r;
      var x = circle.x - otherCircle.x;
      var y = circle.y - otherCircle.y;

      if (a >= Math.sqrt(x * x + y * y)) {
        return true;
      }
    }
  }

  let maxTries = 50;
  let tries = 0;

  while (tries <= maxTries) {
    let newCircle = {
      x: u.random(-50, width - 20),
      y: u.random(-50, height - 20),
      r: u.random(10, 60, 5)
    };

    if (!doesCircleHaveACollision(newCircle)) {
      circles.push(newCircle);
      g.circle(newCircle.r)
        .move(newCircle.x, newCircle.y)
        .attr("mask", "url(#maskedHeavyNoise)")
        .attr("fill", `url(#${u.random(["purple", "pink", "blue"])})`);
    } else {
      // g.circle(newCircle.r)
      //   .move(newCircle.x, newCircle.y)
      //   .attr("fill", 'black');
    }
    tries++;
  }
}

generate();
animate();

function animate() {
  gsap.set(".semi", {
    rotate: "random([90, -90, 0])",
    transformOrigin: "center"
  });

  let t = gsap.timeline({ delay: 0.3, defaults: { ease: "sine.out" } });

  t.from([".screens > *", "circle"], {
    opacity: 0,
    duration: 1
  })
    .from(".pattern > *", { stagger: 0.1, drawSVG: 0 })
    .from(
      ".squares > *",
      {
        opacity: 0,
        stagger: 0.05,
        transformOrigin: "center",
        duration: 0.1
      },
      0.5
    );
}

let refresh = document.querySelector("button");
refresh.addEventListener("click", (e) => {
  generate();
  animate();
});