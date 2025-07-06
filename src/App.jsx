import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const temp = Array.apply(null, Array(400)).map( function(){});
  const [grid, setGrid] = useState(temp)
  const gridRef = useRef(null);

  const [rows] = useState(20);
  const [head, setHead] = useState([Math.floor(rows/2), Math.floor(rows/2)]);
  const [body, setBody] = useState([]);
  const [food, setFood] = useState([-1, -1]);
  const [dir, setDir] = useState('o');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const dirChange = (e) => {
    e.preventDefault();
    if(e.key == 'w' && dir !== 's')  setDir('w');
    else if(e.key == 'a' && dir !== 'd') setDir('a');
    else if(e.key == 's' && dir !== 'w') setDir('s');
    else if(e.key == 'd' && dir !== 'a') setDir('d');
  }

  const generateFood = () => {
    let x = Math.floor(Math.random() * rows);
    let y = Math.floor(Math.random() * rows);

    while (
      (x === head[0] && y === head[1]) ||
      body.includes(x * rows + y)
    ) {
      x = Math.floor(Math.random() * rows);
      y = Math.floor(Math.random() * rows);
    }
    setFood([x, y]);
  }

  const gameRestart = () => {
    setGrid(temp);
    setScore(0);
    setFood([-1, -1]);
    setBody([]);
    setDir('o');
    setHead([Math.floor(rows/2), Math.floor(rows/2)]);
    setOver(false);
  }

  useEffect(() => {
    gridRef.current?.focus();
  }, [])

  useEffect(() => {
    if(!over){
      const interval = setInterval(() => {
        let [x, y] = head;
        let headIdx = x*rows + y;
        if (dir === 'w') x = x - 1 < 0 ? rows-1 : x - 1;
        else if (dir === 'a') y = y - 1 < 0 ? rows-1 : y - 1;
        else if (dir === 's') x = x + 1 > rows-1 ? 0 : x + 1;
        else if (dir === 'd') y = y + 1 > rows-1 ? 0 : y + 1;

        if(body.includes(x * rows + y)){
          setOver(true);
        }
        else{
          let newBody = [...body];
          if(score > 0) newBody.unshift(headIdx);

          if((food[0] === -1 && food[1] === -1) || (food[0] === x && food[1] === y)){
            setScore(score + 1);
            generateFood();
          }
          else{
            newBody.pop();
          }

          setHead([x, y]);
          setBody(newBody);
        }
      }, 150); 
      return () => clearInterval(interval);
    }
  }, [dir, head, food, body])

  useEffect(() => {

  }, [over])

  const borderdecider = () => {
    if(dir === 'w') return 'rounded-t-full';
    else if(dir === 'a') return 'rounded-l-full';
    else if(dir === 's') return 'rounded-b-full';
    else if(dir === 'd') return 'rounded-r-full';
    else  return 'rounded-t-full';
  }

  const handleTouchDir = (newDir) => {
    if ((newDir === 'w' && dir !== 's') ||
        (newDir === 'a' && dir !== 'd') ||
        (newDir === 's' && dir !== 'w') ||
        (newDir === 'd' && dir !== 'a')) {
      setDir(newDir);
    }
  };

  return (
    <div className='bg-green-100 w-screen md:p-0 p-4 h-screen overflow-hidden flex flex-col  md:space-y-0 gap-y-10 md:flex-row md:space-x-5 md:justify-center items-center'>
      <div className={`grid grid-cols-20 grid-rows-20 border-2`} ref={gridRef} tabIndex={0} onKeyDown={dirChange}>
        {
          grid.map((g, i) => (
            <div key={i} className={`border-1 border-gray-200 md:w-[25px] md:h-[25px] w-[20px] h-[20px] flex justify-center items-center 
              ${i == (head[0] * rows + head[1]) ? `bg-green-600 ${borderdecider()}` : ''}
              ${(food[0] == -1 || food[1] == -1) ? '' : i === (food[0] * rows + food[1]) ? 'bg-red-500 rounded-full' : ''}
              ${body.includes(i) ? 'bg-green-400 rounded-md' : ''}
              `} >
            </div>
          ))
        }
      </div>
      <div className='flex flex-col items-center gap-4'>
        <div className={`flex flex-col items-center gap-3 ${!over ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`text-5xl font-semibold`}>
            Game Over
          </div>
          <button onClick={gameRestart} className='bg-blue-400 px-3 py-2 text-xl rounded-lg'>
            Restart
          </button>
        </div>

        <div className='flex flex-row font-semibold text-2xl'>
          <div>Score:</div>
          <div>{score}</div>
        </div>
      </div>

      <div className="mt-6 sm:hidden flex flex-col items-center gap-3">
        <button onClick={() => handleTouchDir('w')} className="arrow-button">↑</button>
        <div className="flex gap-3">
          <button onClick={() => handleTouchDir('a')} className="arrow-button">←</button>
          <button onClick={() => handleTouchDir('s')} className="arrow-button">↓</button>
          <button onClick={() => handleTouchDir('d')} className="arrow-button">→</button>
        </div>
      </div>
    </div>
  )
}

export default App
