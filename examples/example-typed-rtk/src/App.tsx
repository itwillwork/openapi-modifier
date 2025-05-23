import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount } from './features/counter/counterSlice';

function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Redux Toolkit Example</h1>
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={() => dispatch(decrement())}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          -
        </button>
        <span style={{ fontSize: '24px', margin: '0 20px' }}>{count}</span>
        <button
          onClick={() => dispatch(increment())}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          +
        </button>
      </div>
      <div>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ padding: '8px 16px' }}
        >
          Увеличить на 5
        </button>
      </div>
    </div>
  );
}

export default App; 