//setup canvas

//obter referencia ao elemento
const canvas = document.querySelector("canvas");

//obter referencia do paragrafo
const paragrafo = document.querySelector("p");

//inicar o contador de bolas
let contador = 0;

//fornecer o contexto para dar inicio ao desenho
const ctx = canvas.getContext("2d");

//definir a largura e altura
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

//função construtora
/*
cordenada horizontal- x
cordenada vertical  - y
velociada horizontal- velX
velocidade vertical - velY
cor                 - color
tamanho             - size
*/

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

//função construtora da bolas

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

//metodos de um classe
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

//movimentar a bola no espaço disponivel
Ball.prototype.update = function () {
  //se a coordenada x é maior d que a largura maxima...a bola sai pelo lado direito
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  //se a coordenada x é menor que 0 ...a bola sai pelo lado esquerdo
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  //se a coordenada y é maior que a altura maxima então a bola sai pelo fundo
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  //se a coordenada y é menos do que 0 ...a bola sai pela parte de cima
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }
  this.x += this.velX;
  this.y += this.velY;
};

// colisões
Ball.prototype.collisionD = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color =
          "rgb(" +
          aleatorio(0, 255) +
          "," +
          aleatorio(0, 255) +
          "," +
          aleatorio(0, 255) +
          ")";
      }
    }
  }
};

function aleatorio(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//criar uma bola
let balls = [];
while (balls.length < 100) {
  let size = aleatorio(10, 20);
  let ball = new Ball(
    aleatorio(0 + size, width - size),
    aleatorio(0 + size, height - size),
    aleatorio(-7, 7),
    aleatorio(-7, 7),
    true,
    "rgb(" +
      aleatorio(0, 255) +
      "," +
      aleatorio(0, 255) +
      "," +
      aleatorio(0, 255) +
      ")",
    size
  );
  balls.push(ball);
  contador++;
  paragrafo.textContent = "Número de bolas: " + contador;
}

/* Construtor do objeto assassino*/

function Assassino(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = "white";
  this.size = 10;
}
Assassino.prototype = Object.create(Shape.prototype);
Assassino.prototype.constructor = Assassino;

//metodo para desenhar
Assassino.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

//metodo para adicionar os controlos
Assassino.prototype.setControls = function () {
  var _this = this;
  window.onkeydown = function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode == 68) {
      _this.x += _this.velX;
    } else if (e.keyCode == 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode == 83) {
      _this.y += _this.velY;
    }
  };
};

//metodo para movimentar o elemento no espaço visivel
Assassino.prototype.checkBounds = function () {
  if (this.x + this.size >= width) {
    this.x = width;
  }

  if (this.x - this.size <= 0) {
    this.x = -this.x;
  }

  if (this.y + this.size >= height) {
    this.y = height;
  }

  if (this.y - this.size <= 0) {
    this.y = -this.y;
  }
};

//colisoes com o objecto
Assassino.prototype.collisionD = function () {
  //ciclo para percorrer todas as bolas previamente criadas
  for (let j = 0; j < balls.length; j++) {
    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    //verificar colisão
    if (distance < this.size + balls[j].size) {
      balls.splice(j, 1);
      contador--;
      paragrafo.textContent = "Número de bolas: " + contador;
    }
  }
};

//criar o objceto - bola assasino
let assassino = new Assassino(
  aleatorio(0, width),
  aleatorio(0, height),
  aleatorio(-7, 7),
  aleatorio(-7, 7),
  true
);
assassino.setControls();

//desenhar as bolas que foram criadas
function loop() {
  ctx.fillStyle = "rgb(0,0,0,0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionD();
    }
  }
  assassino.draw();
  assassino.checkBounds();
  assassino.collisionD();
  //chama recursivamente a função
  requestAnimationFrame(loop);
}
loop();
