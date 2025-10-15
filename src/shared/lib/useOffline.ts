export function useOffline() {
  function handleOffline() {
    // отправляем на /offline
    if (location.pathname !== '/offline') {
      location.assign('/offline');
    }
  }
  function handleOnline() {
    if (location.pathname === '/offline') {
      history.length > 1 ? history.back() : location.assign('/');
    }
  }
  function start() {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
  }
  function stop() {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  }
  return { start, stop };
}
