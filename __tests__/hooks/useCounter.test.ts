import { act, renderHook } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('useCounter pruebas adicionales', () => {

  it('incrementa correctamente después de varias llamadas', async () => {
    const { result } = await renderHook(() => useCounter());

    await act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(3);
  });


  it('permite decrementar desde cero', async () => {
    const { result } = await renderHook(() => useCounter());

    await act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });


  it('reinicia correctamente después de varios cambios', async () => {
    const { result } = await renderHook(() => useCounter(3));

    await act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);

    await act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(3);
  });


  it('mantiene el estado correcto después de múltiples operaciones', async () => {
    const { result } = await renderHook(() => useCounter());

    await act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
      result.current.increment();
    });

    expect(result.current.count).toBe(2);
  });

});