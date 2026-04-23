const queue = [];
let processing = false;

export function enqueue(action) {
  queue.push(action);
}

export function size() {
  return queue.length;
}

export async function processQueue(handler) {
  if (processing || queue.length === 0) return;
  processing = true;
  try {
    while (queue.length > 0) {
      const item = queue.shift();
      // eslint-disable-next-line no-await-in-loop
      await handler(item);
    }
  } finally {
    processing = false;
  }
}
