const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessBoard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHtml = '';
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement('div');
      squareElement.classList.add('square',
      (rowindex + squareindex) % 2 === 0 ? 'light' : 'dark' // this is line code creates the board squareElements color
    );
    squareElement.dataset.row = rowindex;
    squareElement.dataset.col = squareindex;

    if(square){
      const pieceElement = document.createElement('div');
      pieceElement.classList.add(
        'piece',
        square.color === 'w'? 'white' : 'black'
      );
      pieceElement.innerText = ' ';
      pieceElement.draggable = playerRole === square.color;

      pieceElement.addEventListener('dragstart', (e) => {
        if(pieceElement.draggable){
          draggedPiece = pieceElement;
          sourceSquare = {row : rowindex , col : squareindex};
          e.dataTransfer.setData('text/plain', '');
        }
      });
      pieceElement.addEventListener('dragend', (e) => {
        draggedPiece = null;
        sourceSquare = null;

      });
      squareElement.appendChild(pieceElement);

    }
    squareElement.addEventListener('dragover', function(e){
      e.preventDeafult();
    })
    squareElement.addEventListener('drop',function (e){
      e.preventDeafult();
      if(draggedPiece){
        const targetSource = {
          row : parseInt(squareElement.dataset.row),
          col : parseInt(squareElement.dataset.col),
        };
        handleMove(sourceSquare, targetSource);
      }
    });
    boardElement.appendChild(squareElement);
    });


  });



}

const handleMove = () => {

}

const getPieceUnicode = () => {

}

renderBoard()
