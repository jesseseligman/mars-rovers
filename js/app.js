(function() {
  const { Plateau, Rover } = window.OO_CLASSES;
  const { makeOptions } = window.HELPERS;

  let plateau;
  let rover;
  let instructions;
  let y_dimension;
  let x_dimension;

  //Initialize grid selects
  makeOptions($('.num-select'), 10);

  const renderGrid = (plateau) => {
    $('.grid').remove();
    const $grid = $('<div class="grid"></div>');

    for (let row of plateau.grid) {
      let $row = $('<div class="grid-row"></div>');

      for (let cell of row) {
        $row.append($(`<div class="grid-cell" ${cell ? 'id="rover"' : ''}></div>)`));
      }

      $grid.append($row);
    }
    $('.instructions-container').after($grid);
  }

  const renderRoverPage = () => {
    $('#grid-form').hide();

    $reloadButton = $('<button class="btn btn-default" id="reload">Resize grid</button>');
    $reloadButton.on('click', (e) => window.location.reload());
    $('#grid-container').append($reloadButton);

    $('#user-instructions').text('Please provide coordinates, heading, and instructions for the rover.');
    $('#rover-form').show();
  }

  const processCommand = (command, i) => {
    rover.processCommand(command);

    renderGrid(plateau);
    $('#user-instructions').text(`Current position: (${rover.coords[0]}, ${rover.coords[1]}) ${rover.heading}.`);

    $('.highlighted').removeClass('highlighted');

    $currentCommandLetter = $(`.instructions-container span:nth-child(${(instructions.length + 1) - i})`)
    $currentCommandLetter.addClass('highlighted');
  }

  // Handle grid form submit
  $('#grid-form').submit((e) => {
    e.preventDefault();

    const x = parseInt($('#x-dimension').val(), 10);
    const y = parseInt($('#y-dimension').val(), 10);

    makeOptions($('#rover-x-select'), x);
    makeOptions($('#rover-y-select'), y);

    plateau = new Plateau([x, y]);

    renderGrid(plateau);
    renderRoverPage();
  })

  // Handle rover form submit
  $('#rover-form').submit((e) => {
    e.preventDefault();

    if (rover) {
      plateau.removeItem(rover.coords);
      $('.instructions-container').empty();
    }

    const initial_x = parseInt($('#rover-x-select').val(), 10);
    const initial_y = parseInt($('#rover-y-select').val(), 10);
    const initial_heading = $('#heading').val();

    instructions = $('#instructions').val();

    rover = new Rover([initial_x, initial_y], initial_heading, plateau);
    plateau.addItem(rover, rover.coords);

    // Initial rover state
    for (let letter of instructions) {
      $('.instructions-container').append($(`<span>${letter}</span>`));
    }

    renderGrid(plateau);
    $('#user-instructions').text(`Initial position: (${rover.coords[0]}, ${rover.coords[1]}) ${rover.heading}.`);

    // Rover in movement
    (function commandDelay(i) {
      setTimeout(function() {
        const command = instructions[instructions.length - i];
        processCommand(command, i);

        if (i === 1) {
          // Final rover position
          $('#user-instructions').text(`The rover's final position is (${rover.coords[0]}, ${rover.coords[1]}) ${rover.heading}  -- Deploy another!`);

        }
        if (--i) {
          commandDelay(i);
        }
      }, 1200);
    })(instructions.length);
  })

})();
