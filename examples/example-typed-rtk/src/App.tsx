import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { increment, decrement, incrementByAmount, setValue } from './features/counter/counterSlice';
import { useGetCounterQuery, useSaveCounterMutation } from './features/counter/counterApi';

function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetCounterQuery();
  const [saveCounter] = useSaveCounterMutation();

  useEffect(() => {
    if (data) {
      dispatch(setValue(data.value));
    }
  }, [data, dispatch]);

  const handleIncrement = async () => {
    const newValue = count + 1;
    dispatch(increment());
    await saveCounter({ value: newValue });
  };

  const handleDecrement = async () => {
    const newValue = count - 1;
    dispatch(decrement());
    await saveCounter({ value: newValue });
  };

  const handleIncrementByAmount = async (amount: number) => {
    const newValue = count + amount;
    dispatch(incrementByAmount(amount));
    await saveCounter({ value: newValue });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке данных</div>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Redux Toolkit Example</h1>
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={handleDecrement}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          -
        </button>
        <span style={{ fontSize: '24px', margin: '0 20px' }}>{count}</span>
        <button
          onClick={handleIncrement}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          +
        </button>
      </div>
      <div>
        <button
          onClick={() => handleIncrementByAmount(5)}
          style={{ padding: '8px 16px' }}
        >
          Увеличить на 5
        </button>
      </div>
    </div>
  );
}

export default App; 