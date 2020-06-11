import CFXCallback from '../types/cfxCallback';

function safeInvoke(callback: CFXCallback, args: any) {
  if (typeof callback === 'function') {
    setImmediate(() => {
      callback(args);
    });
  }
}

export default safeInvoke;
