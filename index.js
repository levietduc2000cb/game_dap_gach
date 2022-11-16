window.addEventListener("load", () => {
  const gameStart = document.querySelector("#game_start");
  const userWin = document.querySelector("#game_win");
  const userLose = document.querySelector("#game_over");

  const score = document.querySelector(".score");

  const btnStart = document.querySelector(".btn_yes_start");
  const btnNoStart = document.querySelector(".btn_no_start");

  const btnPlayAgainWin = document.querySelector(".btn_yes_win");
  const btnNoPLayAgainWin = document.querySelector(".btn_no_win");

  const btnPLayAgainOver = document.querySelector(".btn_yes_over");
  const btnNoPlayAgainOver = document.querySelector(".btn_no_over");

  const canvas = document.querySelector("#game");
  const context = canvas.getContext("2d"); // Vẽ thông qua context từ canvas

  /*
context.moveTo(0, 0); // hàm xác định tọa độ để bắt đầu vẽ đường thẳng
context.lineTo(100, 0); // hàm xác định tọa đổ để vẽ từ tọa độ trước đó đến tọa độ này
context.stroke(); // hàm thực hiện vẽ đường thẳng
*/

  // context.strokeStyle = "red";
  // context.rect(0, 0, 20, 5);
  // context.stroke();
  // context.fillStyle = "#ff0000";
  // context.fill();

  let requestFrame;

  let ball = {
    x: 20,
    positionXBallAdd: 0.6,
    y: 20,
    positionYBallAdd: 0.8,
    radius: 2,
  };

  let paddle = {
    width: 28,
    height: 2,
    x: Math.floor(canvas.width / 2),
    y: canvas.height - 2,
    speed: 3,
    pressLeft: false,
    pressRight: false,
  };

  let widthBrick = (canvas.width - 4) / 8;

  let brickConfig = {
    margin: 4,
    width: widthBrick - 4,
    height: 2,
    totalRow: 6,
    totalCol: 8,
    totalBrick: 48,
  };

  let brickList = [];

  for (let i = 0; i < brickConfig.totalRow; i++) {
    for (let j = 1; j <= brickConfig.totalCol; j++) {
      brickList.push({
        x: brickConfig.margin * j + brickConfig.width * (j - 1),
        y: brickConfig.margin + i * (brickConfig.height + brickConfig.margin),
        isBroken: false,
      });
    }
  }

  let userScore = 0;

  let isPlaying = false;

  window.addEventListener("keydown", e => {
    if (e.keyCode === 37) {
      paddle.pressLeft = true;
    } else if (e.keyCode === 39) {
      paddle.pressRight = true;
    }
  });

  window.addEventListener("keyup", e => {
    if (e.keyCode === 37) {
      paddle.pressLeft = false;
    } else if (e.keyCode === 39) {
      paddle.pressRight = false;
    }
  });

  btnStart.addEventListener("click", () => {
    isPlaying = true;
    gameStart.style.display = "none";
    draw();
  });

  btnNoStart.addEventListener("click", () => {
    window.close();
  });

  btnPlayAgainWin.addEventListener("click", () => {
    brickList.forEach(brick => {
      brick.isBroken = false;
    });

    paddle.x = Math.floor(canvas.width / 2);
    paddle.y = canvas.height - 2;

    ball.x = 20;
    ball.y = 20;

    brickConfig.totalBrick = 48;

    userScore = 0;

    userLose.style.display = "none";

    isPlaying = true;

    userWin.style.display = "none";

    draw();
  });

  btnNoPLayAgainWin.addEventListener("click", () => {
    window.close();
  });

  btnPLayAgainOver.addEventListener("click", () => {
    brickList.forEach(brick => {
      brick.isBroken = false;
    });

    paddle.x = Math.floor(canvas.width / 2);
    paddle.y = canvas.height - 2;

    ball.x = 20;
    ball.y = 20;

    brickConfig.totalBrick = 48;

    userScore = 0;

    isPlaying = true;

    userLose.style.display = "none";

    draw();
  });

  btnNoPlayAgainOver.addEventListener("click", () => {
    window.close();
  });

  function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    context.stroke();
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  }

  function handleBallTouchTheBorder() {
    if (ball.x <= ball.radius || ball.x >= canvas.width - ball.radius) {
      ball.positionXBallAdd = -ball.positionXBallAdd;
    }

    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
      ball.positionYBallAdd = -ball.positionYBallAdd;
    }
  }

  function updateBallPosition() {
    ball.x += ball.positionXBallAdd;
    ball.y += ball.positionYBallAdd;
  }

  function drawPadded() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.stroke();
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
  }

  function updatePaddedPosition() {
    if (paddle.pressLeft) {
      paddle.x -= paddle.speed;
    } else if (paddle.pressRight) {
      paddle.x += paddle.speed;
    }
  }

  function handlePaddedTouchTheBorder() {
    if (paddle.x <= 1) {
      paddle.x = 1;
    }

    if (paddle.x >= canvas.width - 29) {
      paddle.x = canvas.width - 29;
    }
  }

  function hanldeBallTouchPadded() {
    if (
      ball.x + ball.radius >= paddle.x &&
      ball.x + ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius >= canvas.height - paddle.height
    ) {
      ball.positionYBallAdd = -ball.positionYBallAdd;
    }
  }

  function drawBricks() {
    brickList.forEach(brick => {
      if (!brick.isBroken) {
        context.beginPath();
        context.rect(brick.x, brick.y, brickConfig.width, brickConfig.height);
        context.stroke();
        context.fillStyle = "purple";
        context.fill();
        context.closePath();
      }
    });
  }

  function BallTouchBricks() {
    brickList.forEach(brick => {
      if (!brick.isBroken) {
        if (
          ball.x >= brick.x &&
          ball.x <= brick.x + brickConfig.width &&
          ball.y + ball.radius >= brick.y &&
          ball.y - ball.radius <= brick.y + brickConfig.height
        ) {
          ball.positionYBallAdd = -ball.positionYBallAdd;
          brick.isBroken = true;
          brickConfig.totalBrick -= 1;
          userScore += 5;
          score.innerText = userScore;
        }
      }
    });
  }

  function handleUserWin() {
    if (brickConfig.totalBrick === 0) {
      isPlaying = false;
      userWin.style.display = "flex";
    }
  }

  function handleUserLose() {
    if (ball.y >= canvas.height - ball.radius) {
      isPlaying = false;
      userLose.style.display = "flex";
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    handleBallTouchTheBorder();
    updateBallPosition();

    drawPadded();
    updatePaddedPosition();
    handlePaddedTouchTheBorder();

    hanldeBallTouchPadded();

    BallTouchBricks();

    drawBricks();

    handleUserWin();
    handleUserLose();
    if (isPlaying) {
      requestFrame = requestAnimationFrame(draw); // xử lý tối ưu cho chuyển động của bóng
    } else {
      cancelAnimationFrame(requestFrame);
    }
  }
});
