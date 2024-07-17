<script>
    import { onMount } from 'svelte';
    import { KenoGame, generateSweepstakesCoins } from '$lib/keno';
  
    let game = new KenoGame();
    let playerNumbers = [];
    let drawnNumbers = [];
    let winnings = 0;
    let sweepstakesCoins = 0;
  
    function selectNumber(num) {
      if (playerNumbers.includes(num)) {
        playerNumbers = playerNumbers.filter(n => n !== num);
      } else if (playerNumbers.length < game.numbersToChoose) {
        playerNumbers = [...playerNumbers, num];
      }
    }
  
    function playGame() {
      drawnNumbers = game.generateNumbers();
      winnings = game.calculateWinnings(playerNumbers, drawnNumbers);
      sweepstakesCoins += generateSweepstakesCoins(winnings);
    }
  
    onMount(() => {
      // Initialize user's sweepstakes coins here, possibly from a database
    });
  </script>
  
  <h1>Keno Game</h1>
  
  <div>
    <h2>Select your numbers (choose {game.numbersToChoose}):</h2>
    {#each Array(game.maxNumbers) as _, i}
      <button on:click={() => selectNumber(i + 1)} class:selected={playerNumbers.includes(i + 1)}>
        {i + 1}
      </button>
    {/each}
  </div>
  
  <button on:click={playGame} disabled={playerNumbers.length !== game.numbersToChoose}>
    Play
  </button>
  
  <div>
    <h2>Drawn Numbers:</h2>
    {#each drawnNumbers as num}
      <span>{num} </span>
    {/each}
  </div>
  
  <div>
    <h2>Winnings: {winnings}</h2>
    <h2>Sweepstakes Coins: {sweepstakesCoins}</h2>
  </div>
  
  <style>
    .selected {
      background-color: yellow;
    }
  </style><script>
  import { onMount } from 'svelte';
  import { KenoGame, generateSweepstakesCoins } from '$lib/keno';
  import Hammer from 'hammerjs';
  import { Howl } from 'howler';

  let game = new KenoGame();
  let playerNumbers = [];
  let drawnNumbers = [];
  let winnings = 0;
  let sweepstakesCoins = 0;
  let gameBoard;

  // Sound effects
  const sounds = {
    select: new Howl({ src: ['/sounds/select.mp3'] }),
    draw: new Howl({ src: ['/sounds/draw.mp3'] }),
    win: new Howl({ src: ['/sounds/win.mp3'] }),
  };

  function selectNumber(num) {
    if (playerNumbers.includes(num)) {
      playerNumbers = playerNumbers.filter(n => n !== num);
    } else if (playerNumbers.length < game.numbersToChoose) {
      playerNumbers = [...playerNumbers, num];
      sounds.select.play();
    }
  }

  async function playGame() {
    drawnNumbers = game.generateNumbers();
    for (let num of drawnNumbers) {
      await new Promise(resolve => setTimeout(resolve, 200));
      sounds.draw.play();
      drawnNumbers = [...drawnNumbers.filter(n => n !== num), num];
    }
    winnings = game.calculateWinnings(playerNumbers, drawnNumbers);
    sweepstakesCoins += generateSweepstakesCoins(winnings);
    if (winnings > 0) sounds.win.play();
  }

  onMount(() => {
    // Initialize user's sweepstakes coins here, possibly from a database

    // Set up Hammer.js for swipe gestures
    const hammer = new Hammer(gameBoard);
    hammer.on('swipeleft swiperight', (ev) => {
      if (ev.type === 'swipeleft') {
        // Handle swipe left (e.g., switch to next game board)
        console.log('Swiped left');
      } else if (ev.type === 'swiperight') {
        // Handle swipe right (e.g., switch to previous game board)
        console.log('Swiped right');
      }
    });
  });
</script>

<h1>Keno Game</h1>

<div bind:this={gameBoard} class="game-board">
  <h2>Select your numbers (choose {game.numbersToChoose}):</h2>
  {#each Array(game.maxNumbers) as _, i}
    <button 
      on:click={() => selectNumber(i + 1)} 
      class:selected={playerNumbers.includes(i + 1)}
      class:drawn={drawnNumbers.includes(i + 1)}
    >
      {i + 1}
    </button>
  {/each}
</div>

<button on:click={playGame} disabled={playerNumbers.length !== game.numbersToChoose}>
  Play
</button>

<div>
  <h2>Drawn Numbers:</h2>
  {#each drawnNumbers as num}
    <span class="drawn-number">{num} </span>
  {/each}
</div>

<div>
  <h2>Winnings: {winnings}</h2>
  <h2>Sweepstakes Coins: {sweepstakesCoins}</h2>
</div>

<style>
  .game-board {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 5px;
  }

  button {
    width: 100%;
    aspect-ratio: 1;
    font-size: 1.2em;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    transition: all 0.3s ease;
  }

  .selected {
    background-color: #ffff00;
    transform: scale(1.1);
  }

  .drawn {
    background-color: #ff9900;
    animation: pulse 0.5s;
  }

  .drawn-number {
    display: inline-block;
    padding: 5px 10px;
    margin: 2px;
    background-color: #ff9900;
    border-radius: 50%;
    animation: fadeIn 0.5s;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>