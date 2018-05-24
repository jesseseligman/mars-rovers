(function() {
  class Rover {
    constructor(coords, heading, plateau) {
      this.plateau = plateau;
      this.coords = coords;
      this.heading = heading;
    }

    processCommand(command) {
      switch(command) {
        case 'M':
        this.move();
        break;
        case 'L':
        case 'R':
        this.rotate(command)
        break;
        default:
        console.log(command);
        throw new Error('Invalid command given.')
      }
    }

    isOutOfBounds(coords) {
      let [x, y] = coords;
      const { grid } = this.plateau;
      if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
        return true;
      }

      return false;
    }

    move() {
      let [x, y] = this.coords;
      let nextCoords;

      switch(this.heading) {
        case 'N':
          nextCoords = [x, y + 1];
          break;
        case 'E':
          nextCoords = [x + 1, y];
          break;
        case 'S':
          nextCoords = [x, y - 1];
          break;
        case 'W':
          nextCoords = [x - 1, y];
          break;
        default:
          throw new Error('This is not a valid heading.');
      }

      if (this.isOutOfBounds(nextCoords)) {
        throw new Error('This move is out of bounds!');
      } else {
        this.plateau.removeItem(this.coords);
        this.plateau.addItem(this, nextCoords);
        this.coords = nextCoords;
      }
    }

    rotate(dir) {
      // circular linked list would be better
      const headings = ['N', 'E', 'S', 'W'];
      const currentHeadingIndex = headings.indexOf(this.heading);

      if (dir === 'R') {
        this.heading = headings[currentHeadingIndex + 1] || 'N';
      } else if (dir === 'L') {
        this.heading = headings[currentHeadingIndex - 1] || 'W';
      } else {
        throw new Error('The direction needs to be "R" or "L"');
      }

    }
  }

  class Plateau {
    constructor(coords) {
      this.grid = this.makeGrid(coords);
    }

    makeGrid(coords) {
      const [x, y] = coords
      const grid = [];
      for (let i = 0; i < y + 1; i++) {
        grid.push(Array.apply(null, new Array(x + 1)));
      }
      return grid;
    }

    // should add any given item to given coordinates on grid
    addItem(item, coords) {
      let [x, y] = coords;
      y = this.grid.length - (y + 1);
      this.grid[y][x] = item;
    }

    removeItem(coords) {
      this.addItem(null, coords);
    }

    makeReadable() {
      const newGrid = this.grid.map((row) => {
        return row.map((space) => {
          if (!space) {
            return 'x';
          } else if (space instanceof Rover) {
            return 'rover'
          }
          return space;
        })
      })
      this.grid = newGrid;
    }
  }

  // Fake module system
  window.OO_CLASSES = {
    Rover,
    Plateau
  }

}
)();
